# 消息队列

- **Kafka（KafkaJS）**：高吞吐、可扩展、顺序与分区、生态成熟 → 互联网公司主流
- **RabbitMQ（amqplib）**：灵活路由（交换机/路由键/队列）、确认/重试/DLX 强 → 传统与金融场景常用
- **Redis Streams（ioredis）**：轻量队列、消费组、低延迟 → 适合中小服务与简化运维
- **AWS SQS（FIFO/Standard）**：全托管、成本低、与 AWS 生态深度整合 → 上云团队常用

## Kafka 模板（kafkajs）

### 1 目录结构

```
kafka-template/
├─ package.json
├─ .env.example
└─ src/
   ├─ index.js                  # 启动入口（示例：启动生产者/消费者）
   ├─ config/
   │  └─ env.js                 # 环境变量加载
   ├─ lib/
   │  ├─ logger.js              # 轻量 logger（与上文日志方案可对接）
   │  ├─ requestContext.js      # requestId/traceId 上下文
   │  └─ idempotencyStore.js    # 幂等存储（示例：内存/可换 Redis/DB）
   ├─ mq/
   │  ├─ kafka.js               # Kafka 客户端（KafkaJS），连接/配置
   │  ├─ topics.js              # 统一主题名/分区/副本约定
   │  ├─ producer.js            # 生产者封装（带键、头、重试）
   │  └─ consumer.js            # 消费者封装（组、并发、重试、DLQ）
   └─ demo/
      └─ runDemo.js             # 演示：发送 + 消费
```

### 2 package.json

```json
{
  "name": "kafka-template",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "NODE_ENV=development node src/index.js",
    "start": "NODE_ENV=production node src/index.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "kafkajs": "^2.2.4",
    "uuid": "^9.0.1"
  }
}
```

### 3 .env.example

```
# Kafka 基本配置
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=order-service
KAFKA_GROUP_ID=order-consumer-group

# 主题名
TOPIC_ORDER_CREATED=order.created.v1
TOPIC_ORDER_DLX=order.dlq.v1

# 其他
ENV=development
LOG_LEVEL=debug
```

### 4 src/config/env.js

```js
const dotenv = require('dotenv');
dotenv.config();

const ENV = process.env.ENV || process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

module.exports = {
  ENV, isProd,
  LOG_LEVEL: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'app-service',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'app-group',
  TOPIC_ORDER_CREATED: process.env.TOPIC_ORDER_CREATED || 'order.created.v1',
  TOPIC_ORDER_DLX: process.env.TOPIC_ORDER_DLX || 'order.dlq.v1'
};
```

### 5 src/lib/logger.js

```js
// 极简 logger（可替换为上文 Pino/Winston）
module.exports = {
  info: (...a) => console.log('[INFO]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERROR]', ...a),
  debug: (...a) => console.debug('[DEBUG]', ...a)
};
```

### 6 src/lib/requestContext.js

```js
const { AsyncLocalStorage } = require('async_hooks');
const { v4: uuidv4 } = require('uuid');
const als = new AsyncLocalStorage();

function runWithContext(fn, ctx = {}) {
  if (!ctx.requestId) ctx.requestId = uuidv4();
  als.run(ctx, fn);
}
function getCtx() { return als.getStore() || {}; }

module.exports = { runWithContext, getCtx };
```

### 7 src/lib/idempotencyStore.js

```js
// 幂等存储示例：生产请替换为 Redis/DB（按 messageId 去重）
const seen = new Set();
async function checkAndSet(id, ttlMs = 10 * 60 * 1000) {
  if (seen.has(id)) return false;
  seen.add(id);
  setTimeout(() => seen.delete(id), ttlMs).unref?.();
  return true;
}
module.exports = { checkAndSet };
```

### 8 src/mq/topics.js

```js
const { TOPIC_ORDER_CREATED, TOPIC_ORDER_DLX } = require('../config/env');
module.exports = {
  ORDER_CREATED: TOPIC_ORDER_CREATED,
  ORDER_DLX: TOPIC_ORDER_DLX
};
```

### 9 src/mq/kafka.js

```js
const { Kafka, logLevel } = require('kafkajs');
const { KAFKA_BROKERS, KAFKA_CLIENT_ID, LOG_LEVEL } = require('../config/env');

const levelMap = { debug: logLevel.DEBUG, info: logLevel.INFO, warn: logLevel.WARN, error: logLevel.ERROR };

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: levelMap[LOG_LEVEL] ?? logLevel.INFO
});

module.exports = { kafka };
```

### 10 src/mq/producer.js

```js
const { kafka } = require('./kafka');
const logger = require('../lib/logger');
const { getCtx } = require('../lib/requestContext');

let producer;
async function getProducer() {
  if (producer) return producer;
  producer = kafka.producer({ allowAutoTopicCreation: false });
  await producer.connect();
  return producer;
}

async function send({ topic, key, value, headers = {} }) {
  const p = await getProducer();
  const ctx = getCtx();
  const enrichedHeaders = { 'x-request-id': ctx.requestId || '', ...headers };
  await p.send({
    topic,
    messages: [{ key, value: Buffer.isBuffer(value) ? value : Buffer.from(value), headers: enrichedHeaders }]
  });
  logger.info('Kafka produced', { topic, key });
}

module.exports = { send };
```

### 11 src/mq/consumer.js

```js
const { kafka } = require('./kafka');
const logger = require('../lib/logger');
const { runWithContext } = require('../lib/requestContext');
const { checkAndSet } = require('../lib/idempotencyStore');
const TOPICS = require('./topics');

async function startConsumer({ groupId, topic, handler, dlqTopic, concurrency = 1 }) {
  const consumer = kafka.consumer({ groupId, allowAutoTopicCreation: false });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      // 还原上下文：从 headers 里拿 requestId
      const reqId = message.headers?.['x-request-id']?.toString() || undefined;
      const msgKey = message.key?.toString();
      const msgVal = message.value?.toString();
      const msgId = message.headers?.['message-id']?.toString() || `${topic}:${partition}:${message.offset}`;
      const attempt = Number(message.headers?.['attempt']?.toString() || '0');

      runWithContext(async () => {
        try {
          // 幂等：重复消息直接跳过
          const first = await checkAndSet(msgId);
          if (!first) {
            logger.warn('Duplicate message skipped', { msgId });
            return;
          }

          await handler({ key: msgKey, value: msgVal, headers: mapHeaders(message.headers) });
          await heartbeat();
        } catch (err) {
          logger.error('Handle failed', { err: err?.message, attempt, msgId });

          // 简单重试策略：<3 次重试，否则发 DLQ
          if (attempt < 3 && dlqTopic) {
            const { send } = require('./producer');
            await send({
              topic,
              key: msgKey,
              value: msgVal,
              headers: { ...mapHeaders(message.headers), attempt: String(attempt + 1) }
            });
          } else if (dlqTopic) {
            const { send } = require('./producer');
            await send({ topic: dlqTopic, key: msgKey, value: msgVal, headers: mapHeaders(message.headers) });
          }
        }
      }, { requestId: reqId });
    },
    partitionsConsumedConcurrently: concurrency
  });
}

function mapHeaders(h = {}) {
  const o = {}; Object.keys(h).forEach(k => o[k] = h[k]?.toString()); return o;
}

module.exports = { startConsumer };
```

12 src/demo/runDemo.js

```js
const TOPICS = require('../mq/topics');
const { send } = require('../mq/producer');
const { startConsumer } = require('../mq/consumer');
const logger = require('../lib/logger');

async function main() {
  // 启动消费者
  await startConsumer({
    groupId: 'order-consumer-group',
    topic: TOPICS.ORDER_CREATED,
    dlqTopic: TOPICS.ORDER_DLX,
    concurrency: 3,
    handler: async ({ key, value, headers }) => {
      logger.info('Consume', { key, value, headers });
      if (value.includes('fail')) throw new Error('mock failure');
    }
  });

  // 发送几条消息
  await send({ topic: TOPICS.ORDER_CREATED, key: 'order-1', value: JSON.stringify({ orderId: 1 }) });
  await send({ topic: TOPICS.ORDER_CREATED, key: 'order-2', value: 'fail_once' });
}

main().catch(console.error);
```

### 13 src/index.js

```js
require('./demo/runDemo');
```

## RabbitMQ 模板（amqplib）

### 1 目录结构

```
rabbitmq-template/
├─ package.json
├─ .env.example
└─ src/
   ├─ index.js
   ├─ config/env.js
   ├─ lib/
   │  ├─ logger.js
   │  └─ idempotencyStore.js
   └─ mq/
      ├─ connection.js        # 连接与 ConfirmChannel（发布确认）
      ├─ topology.js          # 交换机/队列/绑定声明（含 DLX）
      ├─ publisher.js         # 发布封装（持久化、headers、延迟重试两种方案）
      └─ worker.js            # 消费者（prefetch、手动 ack/nack、重试/DLQ）
```

### 2 package.json

```json
{
  "name": "rabbitmq-template",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "NODE_ENV=development node src/index.js",
    "start": "NODE_ENV=production node src/index.js"
  },
  "dependencies": {
    "amqplib": "^0.10.4",
    "dotenv": "^16.4.5",
    "uuid": "^9.0.1"
  }
}
```

### 3 .env.example

```
RABBITMQ_URL=amqp://guest:guest@localhost:5672
EXCHANGE=order.ex
QUEUE_MAIN=order.q
QUEUE_DLX=order.dlq
ROUTING_KEY=order.created
PREFETCH=10
```

### 4 src/config/env.js

```js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  EXCHANGE: process.env.EXCHANGE || 'order.ex',
  QUEUE_MAIN: process.env.QUEUE_MAIN || 'order.q',
  QUEUE_DLX: process.env.QUEUE_DLX || 'order.dlq',
  ROUTING_KEY: process.env.ROUTING_KEY || 'order.created',
  PREFETCH: Number(process.env.PREFETCH || 10)
};
```

### 5 src/lib/logger.js / idempotencyStore.js

```js
module.exports = {
  info: (...a) => console.log('[INFO]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERROR]', ...a)
};
const seen = new Set();
async function checkAndSet(id, ttlMs = 10 * 60 * 1000) {
  if (seen.has(id)) return false;
  seen.add(id);
  setTimeout(() => seen.delete(id), ttlMs).unref?.();
  return true;
}
module.exports = { checkAndSet };
```

### 6 src/mq/connection.js

```js
const amqp = require('amqplib');
const { URL } = require('../config/env');
let conn, channel;

async function getChannel() {
  if (channel) return channel;
  conn = await amqp.connect(URL);
  conn.on('error', console.error);
  conn.on('close', () => process.exit(1));
  // ConfirmChannel：发布确认，确保消息成功入队
  channel = await conn.createConfirmChannel();
  return channel;
}

module.exports = { getChannel };
```

### 7 src/mq/topology.js

```js
const { getChannel } = require('./connection');
const { EXCHANGE, QUEUE_MAIN, QUEUE_DLX, ROUTING_KEY } = require('../config/env');

async function assertTopology() {
  const ch = await getChannel();
  // 声明死信交换机/队列
  await ch.assertExchange(`${EXCHANGE}.dlx`, 'fanout', { durable: true });
  await ch.assertQueue(QUEUE_DLX, { durable: true });
  await ch.bindQueue(QUEUE_DLX, `${EXCHANGE}.dlx`, '');

  // 主交换机（topic 更灵活）
  await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
  // 主队列绑定 DLX（NACK/TTL 达到后进入 DLQ）
  await ch.assertQueue(QUEUE_MAIN, {
    durable: true,
    deadLetterExchange: `${EXCHANGE}.dlx`
  });
  await ch.bindQueue(QUEUE_MAIN, EXCHANGE, ROUTING_KEY);
}

module.exports = { assertTopology };
```

### 8 src/mq/publisher.js

```js
const { getChannel } = require('./connection');
const { EXCHANGE, ROUTING_KEY } = require('../config/env');

async function publish(message, { key = ROUTING_KEY, headers = {}, persistent = true } = {}) {
  const ch = await getChannel();
  const content = Buffer.from(typeof message === 'string' ? message : JSON.stringify(message));
  return new Promise((resolve, reject) => {
    ch.publish(EXCHANGE, key, content, { headers, persistent }, (err, ok) => {
      if (err) return reject(err);
      resolve(ok);
    });
  });
}

// 延迟重试方案 A：每次发布设置 per-message TTL + DLX 回流（无需插件）
async function publishWithDelay(message, delayMs, options = {}) {
  const ch = await getChannel();
  const content = Buffer.from(typeof message === 'string' ? message : JSON.stringify(message));
  const headers = { ...(options.headers || {}) };
  return new Promise((resolve, reject) => {
    ch.publish(EXCHANGE, options.key || ROUTING_KEY, content, {
      headers,
      expiration: String(delayMs), // 过期后进入 DLX
      persistent: options.persistent !== false
    }, (err, ok) => err ? reject(err) : resolve(ok));
  });
}

module.exports = { publish, publishWithDelay };
```

### 9 src/mq/worker.js

```js
const { getChannel } = require('./connection');
const { QUEUE_MAIN, PREFETCH } = require('../config/env');
const logger = require('../lib/logger');
const { checkAndSet } = require('../lib/idempotencyStore');

async function startWorker(handler) {
  const ch = await getChannel();
  await ch.prefetch(PREFETCH);
  await ch.consume(QUEUE_MAIN, async (msg) => {
    if (!msg) return;
    const msgId = msg.properties.messageId || `${msg.fields.deliveryTag}`;
    const headers = msg.properties.headers || {};
    const attempt = Number(headers.attempt || 0);

    try {
      const ok = await checkAndSet(msgId);
      if (!ok) {
        logger.warn('Duplicate message skipped', { msgId });
        ch.ack(msg);
        return;
      }
      const content = msg.content.toString();
      await handler({ content, headers, properties: msg.properties });
      ch.ack(msg);
    } catch (e) {
      logger.error('Handle failed', { err: e.message, attempt, msgId });
      if (attempt < 3) {
        // 重新投递并增加 attempt，简单退避（2^attempt * 1000ms）
        const { publishWithDelay } = require('./publisher');
        const delay = Math.pow(2, attempt) * 1000;
        await publishWithDelay(msg.content.toString(), delay, { headers: { ...headers, attempt: attempt + 1 } });
        ch.ack(msg); // 当前消息完成（由延迟副本继续处理）
      } else {
        ch.nack(msg, false, false); // 直接进入 DLX
      }
    }
  }, { noAck: false });
}

module.exports = { startWorker };
```

### 10 src/index.js

```js
const { assertTopology } = require('./mq/topology');
const { publish } = require('./mq/publisher');
const { startWorker } = require('./mq/worker');

(async () => {
  await assertTopology();

  // 启动消费者
  await startWorker(async ({ content }) => {
    console.log('Consume:', content);
    if (content.includes('fail')) throw new Error('mock fail');
  });

  // 发送两条测试消息
  await publish({ orderId: 1 });
  await publish('fail-once');
})();
```

------

## Redis Streams 模板（ioredis）

### 1 目录结构

```
redis-streams-template/
├─ package.json
├─ .env.example
└─ src/
   ├─ index.js
   ├─ config/env.js
   ├─ lib/logger.js
   └─ mq/
      ├─ redis.js            # 连接
      ├─ producer.js         # XADD 封装
      └─ consumer.js         # 消费组 XREADGROUP/ACK/CLAIM 幂等处理
```

### 2 package.json

```json
{
  "name": "redis-streams-template",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "NODE_ENV=development node src/index.js",
    "start": "NODE_ENV=production node src/index.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "ioredis": "^5.4.1",
    "uuid": "^9.0.1"
  }
}
```

### 3 .env.example

```
REDIS_URL=redis://localhost:6379
STREAM_KEY=order.stream
GROUP=order.group
CONSUMER=worker-1
MAXLEN=100000
BLOCK_MS=10000
```

### 4 src/config/env.js

```js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  STREAM_KEY: process.env.STREAM_KEY || 'order.stream',
  GROUP: process.env.GROUP || 'order.group',
  CONSUMER: process.env.CONSUMER || 'worker-1',
  MAXLEN: Number(process.env.MAXLEN || 100000),
  BLOCK_MS: Number(process.env.BLOCK_MS || 10000)
};
```

### 5 src/mq/redis.js

```js
const Redis = require('ioredis');
const { REDIS_URL } = require('../config/env');
const redis = new Redis(REDIS_URL);
module.exports = { redis };
```

### 6 src/mq/producer.js

```js
const { redis } = require('./redis');
const { STREAM_KEY, MAXLEN } = require('../config/env');
async function xadd(payload) {
  const id = await redis.xadd(STREAM_KEY, 'MAXLEN', '~', MAXLEN, '*', 'data', JSON.stringify(payload));
  return id;
}
module.exports = { xadd };
```

### 7 src/mq/consumer.js

```js
const { redis } = require('./redis');
const { STREAM_KEY, GROUP, CONSUMER, BLOCK_MS } = require('../config/env');

async function ensureGroup() {
  try { await redis.xgroup('CREATE', STREAM_KEY, GROUP, '$', 'MKSTREAM'); } catch (e) { if (!String(e).includes('BUSYGROUP')) throw e; }
}

async function runWorker(handler) {
  await ensureGroup();
  while (true) {
    const res = await redis.xreadgroup('GROUP', GROUP, CONSUMER, 'BLOCK', BLOCK_MS, 'COUNT', 10, 'STREAMS', STREAM_KEY, '>');
    if (!res) continue;
    const [key, entries] = res[0];
    for (const [id, fields] of entries) {
      const payload = JSON.parse(fields[1]);
      try {
        await handler(payload, { id });
        await redis.xack(key, GROUP, id);
        // 可选：处理完成删除条目，避免膨胀
        // await redis.xdel(key, id);
      } catch (e) {
        // 简易重试：把消息放回 pending，后续用 XCLAIM 交给其它消费者
        console.error('handle error', e.message, id);
      }
    }
  }
}

module.exports = { runWorker };
```

### 8 src/index.js

```js
const { xadd } = require('./mq/producer');
const { runWorker } = require('./mq/consumer');

runWorker(async (payload) => {
  console.log('consume', payload);
  if (payload.fail) throw new Error('mock');
});

setInterval(() => xadd({ orderId: Date.now() }), 2000);
setTimeout(() => xadd({ orderId: 'bad', fail: true }), 5000);
```

------

# AWS SQS 模板（@aws-sdk/client-sqs）

### 1 目录结构

```
sqs-template/
├─ package.json
├─ .env.example
└─ src/
   ├─ index.js
   ├─ config/env.js
   ├─ lib/logger.js
   └─ mq/
      ├─ sqs.js              # 客户端封装
      ├─ producer.js         # 发送消息（支持 FIFO 的 GroupId/DedupId）
      └─ worker.js           # 长轮询、可扩展可见性、DLQ 策略
```

### 2 package.json

```json
{
  "name": "sqs-template",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "NODE_ENV=development node src/index.js",
    "start": "NODE_ENV=production node src/index.js"
  },
  "dependencies": {
    "@aws-sdk/client-sqs": "^3.645.0",
    "dotenv": "^16.4.5",
    "uuid": "^9.0.1"
  }
}
```

### 3 .env.example

```
AWS_REGION=ap-southeast-1
SQS_URL=https://sqs.ap-southeast-1.amazonaws.com/123456789012/order-queue
# FIFO 队列示例：以 .fifo 结尾
# SQS_URL=https://sqs.ap-southeast-1.amazonaws.com/123456789012/order-queue.fifo
VISIBILITY_TIMEOUT=30
WAIT_TIME_SECONDS=20
MAX_NUMBER_OF_MESSAGES=10
```

### 4 src/config/env.js

```js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  REGION: process.env.AWS_REGION || 'ap-southeast-1',
  SQS_URL: process.env.SQS_URL,
  VISIBILITY_TIMEOUT: Number(process.env.VISIBILITY_TIMEOUT || 30),
  WAIT_TIME_SECONDS: Number(process.env.WAIT_TIME_SECONDS || 20),
  MAX_NUMBER_OF_MESSAGES: Number(process.env.MAX_NUMBER_OF_MESSAGES || 10)
};
```

### 5 src/mq/sqs.js

```js
const { SQSClient } = require('@aws-sdk/client-sqs');
const { REGION } = require('../config/env');
const sqs = new SQSClient({ region: REGION });
module.exports = { sqs };
```

### 6 src/mq/producer.js

```js
const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const { sqs } = require('./sqs');
const { SQS_URL } = require('../config/env');
const { v4: uuidv4 } = require('uuid');

async function send(payload, { groupId, dedupId } = {}) {
  const params = {
    QueueUrl: SQS_URL,
    MessageBody: typeof payload === 'string' ? payload : JSON.stringify(payload)
  };
  // FIFO 队列需要 MessageGroupId；可选 DeduplicationId（1 分钟窗口）
  if (SQS_URL.endsWith('.fifo')) {
    params.MessageGroupId = groupId || 'default';
    params.MessageDeduplicationId = dedupId || uuidv4();
  }
  return sqs.send(new SendMessageCommand(params));
}

module.exports = { send };
```

### 7 src/mq/worker.js

```js
const { ReceiveMessageCommand, DeleteMessageCommand, ChangeMessageVisibilityCommand } = require('@aws-sdk/client-sqs');
const { sqs } = require('./sqs');
const { SQS_URL, WAIT_TIME_SECONDS, MAX_NUMBER_OF_MESSAGES, VISIBILITY_TIMEOUT } = require('../config/env');

async function poll(handler) {
  while (true) {
    const res = await sqs.send(new ReceiveMessageCommand({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: MAX_NUMBER_OF_MESSAGES,
      WaitTimeSeconds: WAIT_TIME_SECONDS,
      VisibilityTimeout: VISIBILITY_TIMEOUT,
      AttributeNames: ['ApproximateReceiveCount']
    }));

    if (!res.Messages || res.Messages.length === 0) continue;

    for (const m of res.Messages) {
      try {
        const body = parseBody(m.Body);
        await handler(body, m);
        await sqs.send(new DeleteMessageCommand({ QueueUrl: SQS_URL, ReceiptHandle: m.ReceiptHandle }));
      } catch (e) {
        // 可扩展可见性，延长处理时间，或让其超时进入重投/最终到 DLQ（由队列策略控制）
        await sqs.send(new ChangeMessageVisibilityCommand({ QueueUrl: SQS_URL, ReceiptHandle: m.ReceiptHandle, VisibilityTimeout: 0 }));
      }
    }
  }
}

function parseBody(b) { try { return JSON.parse(b); } catch { return b; } }

module.exports = { poll };
```

### 8 src/index.js

```js
const { send } = require('./mq/producer');
const { poll } = require('./mq/worker');

poll(async (data) => {
  console.log('consume', data);
  if (data && data.fail) throw new Error('mock');
});

setInterval(() => send({ orderId: Date.now() }), 2000);
setTimeout(() => send({ orderId: 'bad', fail: true }, { groupId: 'orders' }), 5000);
```

------

## 选型建议（简版）

- **吞吐/规模/多语言生态**：首选 **Kafka**；支持分区顺序、压缩、批处理；但运维稍重
- **复杂路由/业务语义**：**RabbitMQ**（交换机/路由键/队列/TTL/DLX/优先级）灵活
- **轻运维/低延迟/中小队列**：**Redis Streams** 简洁好用，成本低
- **上云/托管**：在 AWS → **SQS**；也可考虑 **MSK（托管 Kafka）**/**Amazon MQ（托管 RabbitMQ/ActiveMQ）**

## 生产落地清单

- **幂等键**（messageId/dedupId）+ 去重存储（Redis/DB）
- **重试与退避**（指数退避、最大次数、DLQ/隔离队列）
- **可观测性**（requestId/traceId、attempt、latency、失败原因）
- **消息模式**（事件驱动、命令、SAGA 编排/补偿）
- **Schema 管理**（Avro/JSON Schema，向后兼容）
- **安全**（TLS/SASL、VPC、最小权限）
- **容量**（分区/并发/预取/批量大小）
- **顺序性**（Kafka 同分区、SQS FIFO、RabbitMQ per-queue）