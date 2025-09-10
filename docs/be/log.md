# 日志处理

## Pino 方案（pino + pino-http + AsyncLocalStorage）

### 1 目录结构

```
pino-logger-template/
├─ package.json
├─ .env.example
├─ nodemon.json
└─ src/
   ├─ server.js                # 应用入口（启动 Express）
   ├─ config/
   │  └─ env.js               # 统一读取/校验环境变量
   ├─ logging/
   │  └─ pino.js              # Pino 基础 logger（区分 dev/prod，脱敏、等级、pretty）
   ├─ middlewares/
   │  ├─ requestContext.js    # 基于 AsyncLocalStorage 保存 requestId & logger
   │  ├─ pinoHttp.js          # pino-http 请求/响应日志（自动记录 latency、status 等）
   │  └─ errorHandler.js      # 兜底错误处理中间件（统一结构化输出）
   └─ routes/
      └─ health.js            # 示例路由
```

### 2 package.json

```json
{
  "name": "pino-logger-template",
  "version": "1.0.0",
  "description": "Enterprise-grade logging with Pino + Express",
  "main": "src/server.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development LOG_PRETTY=1 nodemon src/server.js",
    "start": "cross-env NODE_ENV=production node src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "pino": "^9.3.2",
    "pino-http": "^9.0.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "nodemon": "^3.1.4",
    "pino-pretty": "^11.2.2"
  }
}
```

### 3 .env.example（复制为 .env 使用）

```
# 基础
SERVICE_NAME=user-service
PORT=3000
LOG_LEVEL=info

# 开发环境可设置 LOG_PRETTY=1 以人类可读方式打印
LOG_PRETTY=0

# 可选：当你需要输出到文件时（容器中一般不建议）
LOG_TO_FILE=0
LOG_DIR=./logs
```

### 4 nodemon.json（开发热重载）

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node src/server.js"
}
```

### 5 src/config/env.js

```js
// 统一加载 .env，并导出项目所需的环境变量，集中做默认值/校验
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

module.exports = {
  ENV,
  isProd,
  SERVICE_NAME: process.env.SERVICE_NAME || 'app-service',
  PORT: Number(process.env.PORT || 3000),
  LOG_LEVEL: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  LOG_PRETTY: process.env.LOG_PRETTY === '1', // 仅开发环境建议 true
  LOG_TO_FILE: process.env.LOG_TO_FILE === '1',
  LOG_DIR: process.env.LOG_DIR || path.resolve(process.cwd(), 'logs')
};
```

### 6 src/logging/pino.js

```js
/**
 * Pino 基础 logger：
 * - 生产：输出结构化 JSON 到 stdout（容器/K8s 标配）
 * - 开发：pino-pretty 美化，彩色、单行、带时间
 * - 支持字段脱敏（authorization/cookie/password/token/creditCard 等）
 * - 通过 LOG_LEVEL 控制日志等级
 */
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { LOG_LEVEL, LOG_PRETTY, LOG_TO_FILE, LOG_DIR, SERVICE_NAME, isProd } = require('../config/env');

// 需要脱敏的字段路径（支持深层路径）
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'password',
  'token',
  'creditCard'
];

// 生产环境默认输出 JSON 到 stdout；开发环境可用 pretty
let destination; // 可选：文件输出（不推荐容器中）
if (LOG_TO_FILE) {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  destination = pino.destination({ dest: path.join(LOG_DIR, `${SERVICE_NAME}.log`), sync: false });
}

const baseOptions = {
  level: LOG_LEVEL,
  name: SERVICE_NAME,
  redact: { paths: REDACT_PATHS, censor: '[REDACTED]' }
};

// 根据环境决定 transport（pretty 仅用于非生产）
const logger = !isProd && LOG_PRETTY
  ? pino(
      baseOptions,
      pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          translateTime: 'SYS:standard', // 显示本地时间
          ignore: 'pid,hostname'         // 精简输出
        }
      })
    )
  : pino(baseOptions, destination); // 生产/或非 pretty：直接 JSON 输出

module.exports = logger;
```

### 7 src/middlewares/requestContext.js

```js
/**
 * 为每个请求生成/读取 requestId，并通过 AsyncLocalStorage 注入上下文：
 * - 方便在任意代码处获取当前请求的 logger（带 requestId 绑定）
 */
const { AsyncLocalStorage } = require('async_hooks');
const { v4: uuidv4 } = require('uuid');
const baseLogger = require('../logging/pino');

const als = new AsyncLocalStorage();

function requestContext(req, res, next) {
  // 优先使用网关/反代传入的 X-Request-Id，否则生成一个
  const requestId = req.headers['x-request-id'] || uuidv4();

  // pino-http 会在 req.log 上挂 logger，这里兜底处理
  const logger = (req.log || baseLogger).child({ requestId });

  // 在 ALS 里保存 { requestId, logger }
  als.run({ requestId, logger }, () => {
    // 也把 requestId 回写到响应头，便于前后端/链路排查
    res.setHeader('x-request-id', requestId);
    next();
  });
}

// 在任意地方获取绑定了 requestId 的 logger（若无上下文则返回基础 logger）
function getLogger() {
  const store = als.getStore();
  return store?.logger || baseLogger;
}

module.exports = { requestContext, getLogger };
```

### 8 src/middlewares/pinoHttp.js

```js
/**
 * pino-http：自动记录每个 HTTP 请求/响应的摘要日志
 * - genReqId：统一 requestId 来源
 * - customSuccessMessage/customErrorMessage：自定义日志文案
 * - serializers：控制字段输出（避免过大的 body/headers）
 */
const pinoHttp = require('pino-http');
const { v4: uuidv4 } = require('uuid');
const baseLogger = require('../logging/pino');

module.exports = pinoHttp({
  logger: baseLogger,
  genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
  customLogLevel: function (res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: function (req, res) {
    return `HTTP ${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `HTTP ${req.method} ${req.url} ${res.statusCode} - ${err && err.message}`;
  },
  serializers: {
    // 精简 req/res 输出，避免日志过大
    req(req) {
      return {
        method: req.method,
        url: req.url,
        // headers: req.headers, // 如需排查再打开
        remoteAddress: req.socket?.remoteAddress
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode
      };
    },
    err(err) {
      return {
        type: err.name,
        message: err.message,
        stack: err.stack
      };
    }
  }
});
```

### 9 src/middlewares/errorHandler.js

```js
/**
 * 兜底错误处理：
 * - 统一 JSON 结构
 * - 日志输出带上 requestId
 */
const { getLogger } = require('./requestContext');

function errorHandler(err, req, res, next) {
  const logger = getLogger();
  logger.error({ err }, 'Unhandled error');

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    code: status,
    message: err.expose ? err.message : 'Internal Server Error',
    requestId: res.getHeader('x-request-id')
  });
}

module.exports = errorHandler;
```

### 10 src/routes/health.js

```js
const router = require('express').Router();
const { getLogger } = require('../middlewares/requestContext');

router.get('/health', (req, res) => {
  const logger = getLogger();
  logger.info({ uptime: process.uptime() }, 'Health check');
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/demo-error', (req, res, next) => {
  const logger = getLogger();
  try {
    throw new Error('Demo error for logging');
  } catch (e) {
    logger.warn({ reason: e.message }, 'About to forward an error');
    next(e);
  }
});

module.exports = router;
```

### 11 src/server.js

```js
const express = require('express');
const { PORT, SERVICE_NAME, ENV } = require('./config/env');
const pinoHttp = require('./middlewares/pinoHttp');
const { requestContext } = require('./middlewares/requestContext');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./logging/pino');
const health = require('./routes/health');

const app = express();
app.use(express.json({ limit: '1mb' }));

// 顺序很重要：先打 HTTP 摘要日志，再注入 requestId 上下文
app.use(pinoHttp);
app.use(requestContext);

app.use('/api', health);

// 兜底 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

// 兜底错误
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ env: ENV, service: SERVICE_NAME, port: PORT }, 'Server started');
});
```

## Winston 方案（winston + daily-rotate-file + AsyncLocalStorage）

### 1 目录结构

```
winston-logger-template/
├─ package.json
├─ .env.example
├─ nodemon.json
└─ src/
   ├─ server.js
   ├─ config/
   │  └─ env.js
   ├─ logging/
   │  └─ winston.js          # Winston 基础 logger（dev 彩色/pretty，prod JSON，支持文件轮转）
   ├─ middlewares/
   │  ├─ requestContext.js   # AsyncLocalStorage 注入 requestId
   │  ├─ httpLogger.js       # 自定义 HTTP 访问日志（可替代 morgan/express-winston）
   │  └─ errorHandler.js
   └─ routes/
      └─ health.js
```

### 2 package.json

```json
{
  "name": "winston-logger-template",
  "version": "1.0.0",
  "description": "Enterprise-grade logging with Winston + Express",
  "main": "src/server.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon src/server.js",
    "start": "cross-env NODE_ENV=production node src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "uuid": "^9.0.1",
    "winston": "^3.14.2",
    "winston-daily-rotate-file": "^5.0.0"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "nodemon": "^3.1.4"
  }
}
```

### 3 .env.example

```
SERVICE_NAME=user-service
PORT=3000
LOG_LEVEL=info

# 文件输出配置（容器下建议关闭，只输出到 stdout）
LOG_TO_FILE=0
LOG_DIR=./logs
MAX_SIZE=20m
MAX_FILES=14d
```

### 4 nodemon.json

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node src/server.js"
}
```

### 5 src/config/env.js

```js
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

module.exports = {
  ENV,
  isProd,
  SERVICE_NAME: process.env.SERVICE_NAME || 'app-service',
  PORT: Number(process.env.PORT || 3000),
  LOG_LEVEL: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  LOG_TO_FILE: process.env.LOG_TO_FILE === '1',
  LOG_DIR: process.env.LOG_DIR || path.resolve(process.cwd(), 'logs'),
  MAX_SIZE: process.env.MAX_SIZE || '20m',
  MAX_FILES: process.env.MAX_FILES || '14d'
};
```

### 6 src/logging/winston.js

```js
/**
 * Winston 基础 logger：
 * - 开发：彩色 + 人类可读的 printf 输出
 * - 生产：结构化 JSON 输出到 stdout（容器推荐）
 * - 可选：文件轮转（winston-daily-rotate-file）
 * - 通过自定义 format 注入 AsyncLocalStorage 中的 requestId
 */
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { AsyncLocalStorage } = require('async_hooks');
const { SERVICE_NAME, LOG_LEVEL, LOG_TO_FILE, LOG_DIR, MAX_SIZE, MAX_FILES, isProd } = require('../config/env');

const als = new AsyncLocalStorage(); // 在 middlewares/requestContext.js 中使用同一个实例

// 自定义 format：把 requestId 注入到每条日志
const appendRequestId = winston.format((info) => {
  try {
    const store = als.getStore && als.getStore();
    if (store && store.requestId) info.requestId = store.requestId;
  } catch (_) {}
  return info;
});

const consoleDevFormat = winston.format.combine(
  appendRequestId(),
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${SERVICE_NAME}] ${level} ${requestId ? `(rid:${requestId})` : ''} - ${message}${rest}`;
  })
);

const consoleProdFormat = winston.format.combine(
  appendRequestId(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [];

// 控制台输出（所有环境都建议保留；生产中用于 stdout 收集）
transports.push(new winston.transports.Console({
  level: LOG_LEVEL,
  format: isProd ? consoleProdFormat : consoleDevFormat
}));

// 可选：文件轮转（非容器环境或本地调试时使用）
if (LOG_TO_FILE) {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  transports.push(new DailyRotateFile({
    dirname: LOG_DIR,
    filename: `${SERVICE_NAME}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
    level: LOG_LEVEL,
    format: winston.format.combine(
      appendRequestId(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  }));
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: { service: SERVICE_NAME },
  transports
});

// 导出 logger 与 als，以便中间件使用同一个 ALS 实例
module.exports = { logger, als };
```

### 7 src/middlewares/requestContext.js

```js
/**
 * 统一生成/读取 requestId，并通过同一个 AsyncLocalStorage 实例存储
 * Winston 的自定义 format 会从 ALS 里自动取出 requestId 注入日志
 */
const { v4: uuidv4 } = require('uuid');
const { als } = require('../logging/winston');

function requestContext(req, res, next) {
  const requestId = req.headers['x-request-id'] || uuidv4();
  als.run({ requestId }, () => {
    res.setHeader('x-request-id', requestId);
    next();
  });
}

module.exports = requestContext;
```

### 8 src/middlewares/httpLogger.js

```js
/**
 * 轻量 HTTP 访问日志（可替代 morgan/express-winston）：
 * - 请求进入时记录一条日志，响应完成后再记录一条摘要日志
 * - 根据 statusCode 自动选择 level（2xx=info, 4xx=warn, 5xx=error）
 */
const { logger } = require('../logging/winston');

function httpLogger(req, res, next) {
  const start = Date.now();
  logger.info({ method: req.method, url: req.url }, 'Incoming request');

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, 'Request completed', {
      statusCode: res.statusCode,
      method: req.method,
      url: req.originalUrl || req.url,
      durationMs: duration,
      // remoteAddress: req.socket?.remoteAddress,
    });
  });

  next();
}

module.exports = httpLogger;
```

### 9 src/middlewares/errorHandler.js

```js
const { logger } = require('../logging/winston');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  logger.log(status >= 500 ? 'error' : 'warn', 'Unhandled error', { err });
  res.status(status).json({
    code: status,
    message: err.expose ? err.message : 'Internal Server Error',
    requestId: res.getHeader('x-request-id')
  });
}

module.exports = errorHandler;
```

### 10 src/routes/health.js

```js
const router = require('express').Router();
const { logger } = require('../logging/winston');

router.get('/health', (req, res) => {
  logger.info({ uptime: process.uptime() }, 'Health check');
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/demo-error', (req, res, next) => {
  try {
    throw new Error('Demo error for logging');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```

### 11 src/server.js

```js
const express = require('express');
const { PORT, SERVICE_NAME, ENV } = require('./config/env');
const httpLogger = require('./middlewares/httpLogger');
const requestContext = require('./middlewares/requestContext');
const errorHandler = require('./middlewares/errorHandler');
const { logger } = require('./logging/winston');
const health = require('./routes/health');

const app = express();
app.use(express.json({ limit: '1mb' }));

// 顺序：请求日志 -> 注入 requestId -> 路由 -> 404 -> 错误处理
app.use(httpLogger);
app.use(requestContext);

app.use('/api', health);

app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ env: ENV, service: SERVICE_NAME, port: PORT }, 'Server started');
});
```

## 如何选择 & 环境区分策略

- **开发环境（dev）**
  - Pino：启用 `LOG_PRETTY=1`，`pino-pretty` 彩色单行输出，保留 `debug` 级别
  - Winston：Console 彩色 `printf` 输出，保留 `debug` 级别
  - 方便排查，可临时打开 `req.headers`/`body` 输出（注意脱敏）
- **生产环境（prod）**
  - **统一输出 JSON 到 stdout**，交给 **Fluentd/Vector/Promtail** 收集到 **ELK/Loki/Datadog**
  - 仅 `info` 及以上（建议），异常/慢查询额外打点
  - 严格脱敏：authorization/cookie/token/password/PII 等
  - 可通过 `X-Request-Id` 贯通网关→服务→下游
- **Pino vs Winston**
  - **Pino**：更快、原生 JSON、与 `pino-http` 无缝，适合高并发、容器化微服务
  - **Winston**：格式化能力强、文件轮转成熟，适合需要**本地文件归档**或复杂格式管道

## 运行步骤

以 Pino 模板为例：

```bash
cd pino-logger-template
cp .env.example .env
npm i
npm run dev   # 开发模式（pretty 彩色输出）
# npm start   # 生产模式（JSON 输出）
```

以 Winston 模板为例：

```bash
cd winston-logger-template
cp .env.example .env
npm i
npm run dev
# npm start
```

测试：

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/demo-error
```

## 扩展与企业集成建议

- **链路追踪**：将 `requestId` 与 OpenTelemetry traceId 关联（如从 B3/traceparent 读取）
- **慢请求告警**：在 httpLogger/pino-http 的 `onResFinished` 中若 `durationMs > 阈值`，以 `warn` 级别打日志+告警
- **业务日志规范**：统一字段（`event`, `orderId`, `userId`, `costMs`, `result`）并出文档
- **灰度与多租户**：给日志加上 `tenantId`、`region` 字段便于筛选
- **错误聚合**：接入 Sentry/Datadog，`logger.error({err})` 同步上报
- **日志降噪**：对高频 4xx（如 404 静态资源）做采样或降低等级