# 一、微前端架构（Webpack 5 Module Federation）

## Q1：你是**如何从 0 到 1**落地微前端的？（具体步骤）

**A1（逐步法）：**

1. **仓库与域划分**

   - 以领域（Domain）拆分：`analytics`、`reporting`、`users` 等，每个域一个独立 Git 仓库（remote）。
   - 主应用（host）只做路由聚合与跨域基建（鉴权、壳层 UI、国际化、监控）。

2. **构建层集成：Module Federation 配置**

   - Host 的 `webpack.config.js`（核心片段）：

     ```js
     const { ModuleFederationPlugin } = require("webpack").container;

     module.exports = {
       output: { publicPath: "auto" },
       plugins: [
         new ModuleFederationPlugin({
           name: "host",
           remotes: {
             analytics:
               "analytics@https://cdn.example.com/analytics/1.3.2/remoteEntry.js",
             reporting:
               "reporting@https://cdn.example.com/reporting/2.1.0/remoteEntry.js",
           },
           shared: {
             "@angular/core": {
               singleton: true,
               strictVersion: true,
               requiredVersion: ">=16",
             },
             "@angular/common": { singleton: true, strictVersion: true },
             rxjs: { singleton: true },
           },
         }),
       ],
     };
     ```

   - Remote 的 `webpack.config.js`：

     ```js
     const { ModuleFederationPlugin } = require("webpack").container;

     module.exports = {
       output: { publicPath: "auto", uniqueName: "analytics" },
       plugins: [
         new ModuleFederationPlugin({
           name: "analytics",
           filename: "remoteEntry.js",
           exposes: {
             "./Routes": "./src/app/remote-routes.ts", // 暴露路由
             "./ChartModule": "./src/app/chart/chart.module.ts",
           },
           shared: {
             "@angular/core": { singleton: true },
             rxjs: { singleton: true },
           },
         }),
       ],
     };
     ```

3. **运行时动态加载与路由接入**（Angular 示例）

   - 在 host 的路由里懒加载远程模块：

     ```ts
     const routes: Routes = [
       {
         path: "analytics",
         loadChildren: () =>
           (window as any).analytics
             ? import("analytics/Routes").then((m) => m.default)
             : import("./fallback/analytics-fallback.module").then(
                 (m) => m.FallbackModule
               ),
       },
     ];
     ```

   - 远程路由模块 `remote-routes.ts` 暴露 `Routes` 数组供 host 拼装。

4. **跨应用基建复用（Shared Libraries）**

   - 抽出 **shared UI library / utils / i18n / auth** 做私有 npm 包，语义化版本（`semantic versioning`）发布；各 remote 仅声明依赖，减少重复实现与不一致。

5. **样式隔离**

   - 选型 A：**Shadow DOM**（Angular Elements / Web Components 包裹高内聚组件）
   - 选型 B：BEM + CSS Scope + CSS Vars（当需要主题统一时用 CSS 变量在壳层下发）
   - 选型 C（React 场景）：CSS Modules/Styled Components；在 Angular 场景用样式封装 + ViewEncapsulation。

6. **远程地址与版本解耦（灰度/回滚）**

   - 维护一个 `remote-manifest.json`，host 启动时拉取：

     ```json
     {
       "analytics": "https://cdn.example.com/analytics/1.3.2/remoteEntry.js",
       "reporting": "https://cdn.example.com/reporting/2.1.0/remoteEntry.js"
     }
     ```

   - 灰度：CDN/Edge 按用户百分比/租户维度返回不同版本的 `remoteEntry`；回滚：切换 manifest 指针到上一个稳定版本（几秒内完成，无需重发 host）。

7. **监控与隔离失效保护**

   - Host 侧为每个 remote 装“加载看门人”：加载/渲染超时熔断、出错降级 fallback；Sentry/Datadog 标注 remote 名称做错误归因。

---

## Q2：**跨团队协作与 CI/CD**怎么做，才能保证每个 remote 独立发布又不互相影响？

**A2（Pipeline & 治理）：**

- **每个 remote 独立 Jenkins/GitLab CI**：
  典型 `Jenkinsfile`（精简示例）：

  ```groovy
  pipeline {
    agent any
    stages {
      stage('Install') { steps { sh 'npm ci' } }
      stage('Lint')    { steps { sh 'npm run lint' } }
      stage('Test')    { steps { sh 'npm run test -- --watch=false --code-coverage' } }
      stage('Build')   { steps { sh 'npm run build' } }
      stage('Publish') {
        steps {
          sh 'node scripts/version.js' // 生成版本号：1.3.2+gitsha
          sh 'aws s3 sync dist s3://cdn/analytics/$VERSION/'
          sh 'aws s3 cp remoteEntry.js s3://cdn/analytics/$VERSION/remoteEntry.js'
        }
      }
      stage('Release-Manifest') {
        when { branch 'main' }
        steps { sh 'node scripts/update-manifest.js $VERSION' } // 修改 remote-manifest 指针（支持灰度）
      }
    }
    post { always { slackSend channel: '#fe', message: "Deploy $JOB_NAME:$BUILD_NUMBER $BUILD_STATUS" } }
  }
  ```

- **质量门禁**：lint、type-check、unit test、coverage 阈值、bundle 体积预算（performance budget），全部过关才能发布。

- **版本与回滚**：remote 产物永不覆盖（版本路径），manifest 指针切换即回滚。

- **契约管理**：暴露面向 host 的最小稳定接口（`exposes` 面只出 “路由 + 核心模块”），跨团队协作靠约定而非源代码内耦合。

---

# 二、代码规范 & 质量控制（从“建议”到“硬性门禁”）

## Q3：你如何**统一并强制**团队代码规范？

**A3（落地清单）：**

1. **统一配置落库**

   - `.eslintrc.js`（要点示例）：

     ```js
     module.exports = {
       root: true,
       parser: "@typescript-eslint/parser",
       plugins: ["@typescript-eslint", "import"],
       extends: [
         "eslint:recommended",
         "plugin:@typescript-eslint/recommended",
         "plugin:import/recommended",
         "plugin:import/typescript",
         "prettier",
       ],
       rules: {
         "@typescript-eslint/no-explicit-any": "warn",
         "import/no-cycle": "error",
         "import/order": [
           "error",
           { "newlines-between": "always", alphabetize: { order: "asc" } },
         ],
       },
     };
     ```

   - `.prettierrc`：

     ```json
     { "singleQuote": true, "printWidth": 100, "trailingComma": "all" }
     ```

   - `.editorconfig`：统一缩进/换行/编码，保证 IDE 无差异。

2. **提交前自动修复**（本地硬门禁）

   - `husky` + `lint-staged`：

     ```json
     // package.json
     {
       "lint-staged": {
         "*.{ts,tsx,js}": ["eslint --fix", "prettier --write"],
         "*.{scss,css,json,md}": ["prettier --write"]
       }
     }
     ```

     ```bash
     # .husky/pre-commit
     npx lint-staged
     # .husky/pre-push
     npm run typecheck && npm run test:ci
     ```

   - `typecheck` 脚本：`tsc --noEmit -p tsconfig.json`，在推送前就把类型问题拦下。

3. **提交信息规范化**（可追溯）

   - `commitlint` + Conventional Commits（`feat/fix/chore`），自动生成 CHANGELOG，为回滚/比对提供依据。

4. **CI 硬门禁**

   - Pipeline 顺序：`install → lint → typecheck → unit test → build → bundle-size-check → deploy`。
   - 任一环节失败即阻断；保护分支策略：必须通过 CI + 代码评审才能合并。

5. **安全与合规（可选加分）**

   - Secrets 扫描（如 `gitleaks`），License 审核（如 `license-checker`），第三方依赖漏洞扫描（如 `npm audit`/Snyk）。

> 面试时关键词：**“本地 pre-commit/pre-push + 远端 CI 双门禁”**；**“ESLint/Prettier 规则固化 + CI fail-fast”**；**“Conventional Commits 支撑变更可追溯”**。你的简历里提到已引入 ESLint/Prettier 并做质量把控，这套话术是对它的工程化升级版。

---

# 三、测试驱动（把 80% 覆盖率做成“制度化”）

## Q4：你是**如何把覆盖率稳定在 80%+**并形成制度的？

**A4（制度 + 工具）：**

1. **阈值写进配置**

   - `karma.conf.js`（Angular + Jasmine/Karma）：

     ```js
     coverageReporter: {
       reporters: [{ type: 'html' }, { type: 'text-summary' }],
       check: {
         global: { statements: 80, branches: 70, functions: 80, lines: 80 }
       }
     }
     ```

   - CI 中读取覆盖率报告，不达标直接 fail；PR 模板要求列出新增/变更逻辑对应的测试用例编号。

2. **测试金字塔**

   - **单测（Unit）**：组件/服务/管道/工具函数
   - **集成（Integration）**：包含 Ngrx Store/Effects 的数据流、模块内协作
   - **端到端（E2E，可选）**：关键用户路径冒烟（如登录 → 打开图表 → 导出报表）

3. **用例“清单化”**：每个 MR 对照需求拆三类用例：成功路径 / 失败路径 / 边界条件，并在 PR 里勾选。

> 简历里你已写“引入 Jasmine，覆盖率 80%+”，面试时把“阈值在配置里硬编码 + CI 强制 + PR 清单化”说清楚，就非常具体可信。

---

## Q5：组件单测你**具体怎么写**？（Angular 示例）

**A5（TestBed 与替身）：**

```ts
import { TestBed, ComponentFixture } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { ChartComponent } from "./chart.component";
import { selectDataSource } from "../store/selectors";

describe("ChartComponent", () => {
  let fixture: ComponentFixture<ChartComponent>;
  let store: MockStore;
  const initialState = { data: { source: [] } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectDataSource, [{ x: 1, y: 2 }]);

    fixture = TestBed.createComponent(ChartComponent);
    fixture.detectChanges();
  });

  it("should render chart with store data", () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector(".chart")).toBeTruthy();
  });
});
```

要点：**TestBed** 搭环境、**MockStore** 提供选择器数据、`fixture.detectChanges()` 触发变更检测；避免真实接口与外部依赖。

---

## Q6：Ngrx 的 **Reducer/Effects** 你怎么测？

**A6（Reducer 纯函数、Effects Marble）：**

- **Reducer**：输入 state + action，断言输出（表驱动）：

  ```ts
  it("should handle loadSuccess", () => {
    const state = reducer(initialState, loadSuccess({ items: [1, 2] }));
    expect(state.items.length).toBe(2);
  });
  ```

- **Effects（Marble 测试）**：用 `jasmine-marbles`/`TestScheduler`：

  ```ts
  it("load$ should dispatch loadSuccess", () => {
    actions$ = hot("-a", { a: load() });
    const response = cold("-b|", { b: [1, 2] });
    spyOn(api, "fetch").and.returnValue(response);

    const expected = cold("--c", { c: loadSuccess({ items: [1, 2] }) });
    expect(effects.load$).toBeObservable(expected);
  });
  ```

---

## Q7：HTTP 请求如何 **Mock**？错误场景怎么测？

**A7（HttpTestingController）：**

```ts
it("should call GET /reports and handle error", () => {
  const httpMock = TestBed.inject(HttpTestingController);
  service.getReports().subscribe({
    next: () => fail("should error"),
    error: (e) => expect(e.status).toBe(500),
  });

  const req = httpMock.expectOne("/api/reports");
  expect(req.request.method).toBe("GET");
  req.flush(
    { message: "server error" },
    { status: 500, statusText: "Server Error" }
  );

  httpMock.verify();
});
```

要点：**断言请求方法/URL**、模拟 **500**、验证 **错误分支** 是否被覆盖（确保达到覆盖率目标）。

---

## Q8：图表/可视化组件（Plotly → Highcharts）迁移你如何保障不回归？

**A8（快照行为对齐 + 适配层 + 单测）：**

- **适配层**：抽象统一的 `IChartOptions`，高层组件不感知底层库差异。
- **对齐用例**：为常见图型（柱/折/饼）准备“同一组输入 → 期望的渲染行为/事件回调”；替换前后跑同一套单测。
- **关键交互**（tooltip、legend、brush、导出）以 **单测 + 小型集成测试** 验证。
- **覆盖率门禁** 确保迁移时新增测试不会掉线。

---

### 你可以这样在面试里总结（30 秒版本）

- **微前端**：用 **Module Federation** 做运行时动态装配，远程模块版本由 `remote-manifest` 控制，**灰度/回滚** 只切指针；每个 remote **独立 CI/CD** 和 **质量门禁**。
- **规范 & 质量**：**pre-commit/pre-push + CI 双门禁**、ESLint/Prettier/TypeCheck 一套到底、**Conventional Commits** 保障可追溯。
- **测试**：把 **覆盖率阈值写进 karma 配置**，CI 强制；Angular 用 **TestBed/MockStore/HttpTestingController**，Ngrx 用 **Marble** 测 Effects；迁移以 **适配层 + 同步用例** 保稳。
