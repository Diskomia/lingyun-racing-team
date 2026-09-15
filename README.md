# 🏎️ 河北工程大学 · 凌云车队 (LingYun Racing Team)

**中国大学生电动方程式大赛 (Formula Student Electric China - FSEC) 官方车队门户网站**

> **队训 / 校训**：崇德尚善，精工铸新 · 智造梦想，擎动未来  
> **创立时间**：2012年12月（学校卓越工程创新名片）  
> **主管部门**：河北工程大学教务处 / 机械与装备工程学院  
> **车间基地**：河北工程大学42号楼工程实训中心101 / 105  
> **官方邮箱**：`joshuawang1225@gmail.com`  

---

## ⚡ 技术与商业 · 双核驱动 (Dual Pillars: Technology & Business)

车队构建了工程研发与商业运营高度协同的现代化方程式赛车队体系：
- **技术硬实力 (Engineering Excellence)**：深耕双永磁同步电机同轴电驱架构、504V/7.1kWh 15C 动力电池箱、4130 铬钼钢高刚度空间桁架、全碳纤维推杆悬架、TC4 钛合金半轴与 STAR-CCM+ 气动套件。
- **商业软实力 (Commercial & Operations)**：严谨推行项目制管理，涵盖全生命周期成本控制 (Cost Report)、商业逻辑答辩 (BOP)、品牌赞助拓展与全媒体宣发矩阵（蝉联 FSEC 年度优秀宣传团队）。

## 🏛️ 两大组织中枢体系 (Two Big Divisions)

1. **技术组 (Technical Division - 技术总监分管)**：
   - **机械组 (Mechanical Group)**：4130 空间桁架设计与高斯焊接应力仿真、全碳推杆双横臂悬架动力学、43% 阿克曼转向、STAR-CCM+ 气动套件、TC4 钛合金半轴与 AP Racing 制动系统。
   - **电气组 (Electrical Group)**：双 EMRAX 208 同轴高压电驱、504V/7.1kWh 15C 动力电池箱与流热耦合风冷温控、自研 BMS 架构、Burckhardt 驱动防滑与电子差速、STM32H7 智能方向盘与 CAN-FD 高速遥测。
2. **商业组 (Business Division - 商业经理分管)**：
   - **FSEC 静态赛答辩**：主导商业逻辑报告 (BOP) 与工程制造成本分析 (Cost Report) 全英文答辩。
   - **校企赞助招商对接**：开拓企业赞助伙伴，争取软硬件工具与资金支持，落实校招直聘通道与品牌车身露出。
   - **品牌宣传与文创**：运营官方公众号、B站与抖音新媒体矩阵（连续两年荣获 FSEC 年度优秀宣传团队）。
   - **社会服务与科普**：承担科普实践教学功能，接待邯郸四中、石家庄工程技术学校等师生参观车间。

## 🏗️ 工业级分模块统一工程架构 (Modular Architecture)

项目遵循高内聚、低耦合、分层解耦的工业级静态站点规范，实现 JS、CSS 与 HTML 的三维模块化架构：

```text
racing-team-website/
├── index.html                    # 统一标注 data-module 与 data-component 的语义化主文档
├── README.md
├── scripts/
│   └── build.js                  # 模块完整性审查、CSS 自动同步与架构校验系统
└── assets/
    ├── css/
    │   ├── style.css             # 高性能合并分发主样式表 (零阻塞并行加载)
    │   └── modules/              # ITCSS 体系解耦分层样式模块
    │       ├── 00-tokens.css     # Design Tokens (色彩、圆角、字体、材质变量)
    │       ├── 01-base.css       # 基础重置、排版、平滑滚动
    │       ├── 02-components.css # 进度条、导航栏、玻璃卡片、3D视差
    │       ├── 03-sections.css   # 领奖台高光、Pit-Board 倒计时、水印
    │       ├── 04-interactive.css# 热点雷达、弹窗中枢、Toast通知、回到顶部
    │       └── 05-utilities.css  # content-visibility 性能隔离、无障碍动效降级
    ├── js/
    │   ├── main.js               # 工业级 AST 混淆加密分发脚本 (由 build.js 统一编译混淆，防复刻与技术数据保护)
    │   └── modules/              # 17 个独立自治业务子模块 (Single Source of Truth)
    │       ├── debug.js          # LYDebug (轻量级调试日志、时间线诊断与 URL ?debug=1 激活)
    │       ├── config.js         # ENGINE_CONFIG (集中式配置中心)
    │       ├── scroll.js         # UnifiedScrollEngine (滚动调度与指标预存)
    │       ├── ticker.js         # TickerLifecycle (跑马灯视口可见性休眠)
    │       ├── tilt.js           # F1TiltEngine (3D 视差与微倾角控制)
    │       ├── telemetry.js      # CarTelemetryHUD (赛车子系统雷达热点拆解)
    │       ├── car-specs.js      # CarSpecTabs (5 大专业面板与仿真工具链)
    │       ├── reveal.js         # ScrollRevealEngine (视口平滑渐入流)
    │       ├── counters.js       # TelemetryCounters (三次方插值与脏值过滤)
    │       ├── countdown.js      # CountdownTimer (FSEC 赛历倒计时与休眠)
    │       ├── filters.js        # ActivityFilters (赛事动态与纪实筛选)
    │       ├── modal.js          # ModalEngine (弹窗中枢与无障碍焦点锁定)
    │       ├── toast.js          # ToastSystem (Apple 质感非阻塞通知与 PDF 下载)
    │       ├── nav.js            # MobileNav (移动端折叠抽屉导航)
    │       ├── forms.js          # FormDispatcher (招募/赞助/留言邮件表格化外发至 joshuawang1225@gmail.com)
    │       ├── security.js       # SecurityShield (防复刻快捷键拦截、防右键抓取与版权署名防篡改)
    │       └── bootstrap.js      # AppBootstrap (各模块独立错误边界 try/catch 隔离初始化)
    ├── docs/
    │   └── 河北工程大学凌云车队_2026赛季FSEC商业赞助招商手册.pdf
    └── images/
```

### 架构构建、同步与回归校验

在终端中执行以下命令可自动编译 JS 模块、同步 CSS 样式并运行 6 阶段完整架构与合规验证：

```bash
node scripts/build.js
```

#### 开发者调试模式 (Developer Debug Mode)

- **URL 参数激活**：在浏览器中打开 `index.html?debug=1` 即可开启控制台调试日志输出。
- **控制台交互 API**：
  - `LingYun.debug.dump()`：在控制台展开所有模块的初始化时间线与诊断信息。
  - `LingYun.debug.getModuleLog('UnifiedScrollEngine')`：过滤查看特定模块的生命周期记录。
  - `LingYun.debug.getErrors()`：快速审查是否存在未捕获的子模块初始化异常。
  - `LingYun.debug.enable()` / `LingYun.debug.disable()`：动态切换调试开关。

