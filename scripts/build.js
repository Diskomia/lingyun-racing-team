/**
 * =========================================================================
 * 🏎️ LINGYUN RACING TEAM - 2026 49号 模块化架构工程同步与校验系统
 * (Architecture Validation, AST Obfuscation & Security Build Pipeline)
 * =========================================================================
 *
 * 构建管线 (Build Pipeline):
 *  [1/6] JS 模块语法验证 (17 个独立子模块)
 *  [2/6] CSS 模块验证 (6 层 ITCSS)
 *  [3/6] CSS 模块合并 → style.css
 *  [4/6] JS 模块合并 → 生成 main.dev.js 与 工业级 AST 混淆加密 main.js
 *  [5/6] 运行期命名空间与语法验证
 *  [6/6] index.html 语义 & 禁词审查
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let JavaScriptObfuscator;
try {
  JavaScriptObfuscator = require('javascript-obfuscator');
} catch (e) {
  // 如果当前路径找不到，尝试从本地 node_modules 加载
  const localObf = path.join(__dirname, '..', 'node_modules', 'javascript-obfuscator');
  if (fs.existsSync(localObf)) {
    JavaScriptObfuscator = require(localObf);
  }
}

const rootDir = path.resolve(__dirname, '..');
const jsModulesDir = path.join(rootDir, 'assets', 'js', 'modules');
const cssModulesDir = path.join(rootDir, 'assets', 'css', 'modules');
const mainJsPath = path.join(rootDir, 'assets', 'js', 'main.js');
const mainDevJsPath = path.join(rootDir, 'assets', 'js', 'main.dev.js');
const styleCssPath = path.join(rootDir, 'assets', 'css', 'style.css');
const htmlPath = path.join(rootDir, 'index.html');

console.log('================================================================');
console.log('🏎️  LINGYUN RACING TEAM - SECURITY & OBFUSCATION BUILD PIPELINE');
console.log('================================================================\n');

let errorCount = 0;

// ─────────────────────────────────────────────────────────────────────────
// [1/6] 验证 JS 独立模块完整性与语法 (17 个自治模块)
// ─────────────────────────────────────────────────────────────────────────
console.log('📦 [1/6] Verifying JavaScript Modules (assets/js/modules/)...');

const expectedJsModules = [
  'debug.js',       // 调试基础设施 (无依赖)
  'config.js',      // 全局配置 (无依赖)
  'scroll.js',      // 滚动引擎 (依赖 config)
  'ticker.js',      // 跑马灯 (无依赖)
  'tilt.js',        // 3D 倾角 (依赖 config)
  'telemetry.js',   // 车辆 HUD (无依赖)
  'car-specs.js',   // 赛车规格 (无依赖)
  'reveal.js',      // 滚动揭示 (无依赖)
  'counters.js',    // 数值计数器 (依赖 config)
  'countdown.js',   // 倒计时 (依赖 config)
  'filters.js',     // 活动筛选 (无依赖)
  'modal.js',       // 弹窗引擎 (依赖 toast)
  'toast.js',       // Toast 通知 (无依赖)
  'nav.js',         // 移动导航 (无依赖)
  'forms.js',       // 全局表单与双向邮件投递分发器 (依赖 toast)
  'security.js',    // 客户端安全防护与防复刻防篡改引擎 (无依赖)
  'bootstrap.js'    // 启动协调 (依赖所有模块)
];

expectedJsModules.forEach(mod => {
  const filePath = path.join(jsModulesDir, mod);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing JS Module: assets/js/modules/${mod}`);
    errorCount++;
  } else {
    try {
      execSync(`node -c "${filePath}"`);
      console.log(`  ✅ [PASS] assets/js/modules/${mod} (Syntax OK)`);
    } catch (e) {
      console.error(`  ❌ Syntax Error in assets/js/modules/${mod}:`, e.message);
      errorCount++;
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────
// [2/6] 验证 CSS 独立模块分层完整性
// ─────────────────────────────────────────────────────────────────────────
console.log('\n🎨 [2/6] Verifying CSS Modules (assets/css/modules/)...');
const expectedCssModules = [
  '00-tokens.css',
  '01-base.css',
  '02-components.css',
  '03-sections.css',
  '04-interactive.css',
  '05-utilities.css'
];

expectedCssModules.forEach(mod => {
  const filePath = path.join(cssModulesDir, mod);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing CSS Module: assets/css/modules/${mod}`);
    errorCount++;
  } else {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.length < 50) {
      console.error(`  ❌ CSS Module ${mod} seems too short or empty`);
      errorCount++;
    } else {
      console.log(`  ✅ [PASS] assets/css/modules/${mod} (${content.length} bytes)`);
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────
// [3/6] 校验并同步 assets/css/style.css
// ─────────────────────────────────────────────────────────────────────────
console.log('\n🔄 [3/6] Syncing assets/css/style.css from CSS Modules...');
try {
  let combinedCss = `/* ==========================================================================\n   🏎️ LINGYUN RACING TEAM - APPLE-INSPIRED MOTORSPORT DESIGN SYSTEM (CONSOLIDATED)\n   Generated from modular sources in assets/css/modules/\n   ⚠️  AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY\n   ========================================================================== */\n\n`;
  expectedCssModules.forEach(mod => {
    const filePath = path.join(cssModulesDir, mod);
    combinedCss += fs.readFileSync(filePath, 'utf8') + '\n\n';
  });

  fs.writeFileSync(styleCssPath, combinedCss.trim() + '\n', 'utf8');
  console.log(`  ✅ [PASS] assets/css/style.css synchronized successfully (${combinedCss.length} bytes)`);
} catch (err) {
  console.error('  ❌ Error synchronizing style.css:', err);
  errorCount++;
}

// ─────────────────────────────────────────────────────────────────────────
// [4/6] ⚡ JS 模块打包与 AST 深度加密混淆 (核心防复刻构建)
// ─────────────────────────────────────────────────────────────────────────
console.log('\n⚡ [4/6] Bundling & Encrypting assets/js/main.js from Modules...');

function extractModuleCore(source) {
  let code = source;
  code = code.replace(/^\s*'use strict';\s*\n/m, '');
  code = code.replace(/^\s*\(function\s*\(\s*global\s*\)\s*\{\s*\n/m, '');
  code = code.replace(/\n\s*\}\)\s*\(\s*typeof\s+window\s*!==\s*'undefined'\s*\?\s*window\s*:\s*this\s*\)\s*;\s*$/m, '');
  code = code.replace(/\n\s*\/\/\s*挂载至统一命名空间\n\s*global\.LingYun\s*=\s*global\.LingYun\s*\|\|\s*\{\};\n/g, '\n');
  code = code.replace(/\s*global\.LingYun\.\w+\s*=\s*\w+;\n?/g, '');
  code = code.replace(/\n\s*\/\/\s*向后兼容全局作用域\n\s*global\.\w+\s*=\s*\w+;\n?/g, '\n');
  code = code.replace(/\bglobal\.(LingYun|lucide|showToast|downloadSponsorshipDeck|IntersectionObserver)/g, 'window.$1');
  code = code.replace(/\bglobal\.(\w+)/g, 'window.$1');
  code = code.replace(/\n{3,}/g, '\n\n');
  return code.trim();
}

try {
  const coreModules = expectedJsModules.filter(m => m !== 'bootstrap.js');

  const moduleIndex = expectedJsModules.map((m, i) => {
    const name = m.replace('.js', '');
    return ` *  - ${String(i).padStart(2, '0')}. ${name}`;
  }).join('\n');

  let combinedJs = `/**
 * =========================================================================
 * 🏎️ LINGYUN RACING TEAM - 2026 49号 模块化交互引擎
 * (High-Performance Modular Motorsport Interaction Engine)
 * =========================================================================
 *
 * ⚠️  AUTO-GENERATED & OBFUSCATED DISTRIBUTION BUNDLE
 * All rights reserved. Unauthorized copying or reverse engineering is prohibited.
 *
 * 模块索引 (Module Directory):
${moduleIndex}
 * =========================================================================
 */

(function(window) {
'use strict';

window.LingYun = window.LingYun || {};

`;

  let moduleCount = 0;
  coreModules.forEach(mod => {
    const filePath = path.join(jsModulesDir, mod);
    if (!fs.existsSync(filePath)) return;

    const source = fs.readFileSync(filePath, 'utf8');
    const core = extractModuleCore(source);
    const modName = mod.replace('.js', '');

    const headerMatch = source.match(/Module:\s*\d+\s*-\s*(.+?)(?:\s*\((.+?)\))?\s*\n/);
    const headerDesc = headerMatch ? headerMatch[1].trim() : modName;

    combinedJs += `/* ==========================================================================\n`;
    combinedJs += `   ${modName} - ${headerDesc}\n`;
    combinedJs += `   ========================================================================== */\n`;
    combinedJs += core + '\n\n';
    moduleCount++;
  });

  const bootstrapPath = path.join(jsModulesDir, 'bootstrap.js');
  const bootstrapSource = fs.readFileSync(bootstrapPath, 'utf8');
  const bootstrapCore = extractModuleCore(bootstrapSource);

  const namespaceRegistrations = [
    'ENGINE_CONFIG',
    'UnifiedScrollEngine',
    'TickerLifecycle',
    'F1TiltEngine',
    'CarTelemetryHUD',
    'CarSpecTabs',
    'ScrollRevealEngine',
    'TelemetryCounters',
    'CountdownTimer',
    'ActivityFilters',
    'ModalEngine',
    'showToast',
    'MobileNav',
    'FormDispatcher',
    'SecurityShield'
  ];

  combinedJs += `/* ==========================================================================\n`;
  combinedJs += `   命名空间注册 — 将所有模块挂载至 window.LingYun\n`;
  combinedJs += `   ========================================================================== */\n`;
  namespaceRegistrations.forEach(name => {
    combinedJs += `window.LingYun.${name} = ${name};\n`;
  });
  combinedJs += `window.LingYun.downloadSponsorshipDeck = window.downloadSponsorshipDeck;\n`;
  combinedJs += `window.LingYun.debug = LYDebug;\n\n`;

  combinedJs += `/* ==========================================================================\n`;
  combinedJs += `   bootstrap - AppBootstrap (全站各子系统统一挂载协调中枢)\n`;
  combinedJs += `   ========================================================================== */\n`;
  combinedJs += bootstrapCore + '\n';
  combinedJs += `window.LingYun.initApp = initApp;\n`;
  combinedJs += `\n})(window);\n`;

  // 1. 保存本地开发诊断版本 main.dev.js (不提交至公开仓库)
  fs.writeFileSync(mainDevJsPath, combinedJs, 'utf8');
  console.log(`  📁 [DEV] assets/js/main.dev.js generated for local diagnostics (${combinedJs.length} bytes)`);

  // 2. 工业级 AST 混淆加密 (写入公开分发文件 main.js)
  if (JavaScriptObfuscator) {
    console.log(`  🔒 [OBFUSCATE] Applying AST identifier mangling & base64 string encryption...`);
    const obfuscated = JavaScriptObfuscator.obfuscate(combinedJs, {
      compact: true,
      controlFlowFlattening: false, // 保持 0% 渲染开销以维系 60/120fps 极速滚动
      deadCodeInjection: false,     // 避免无意义垃圾代码拖慢事件帧
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      selfDefending: false,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.8,
      splitStrings: true,
      reservedNames: [
        'LingYun',
        'showToast',
        'downloadSponsorshipDeck',
        'ENGINE_CONFIG',
        'UnifiedScrollEngine',
        'TickerLifecycle',
        'F1TiltEngine',
        'CarTelemetryHUD',
        'CarSpecTabs',
        'ScrollRevealEngine',
        'TelemetryCounters',
        'CountdownTimer',
        'ActivityFilters',
        'ModalEngine',
        'MobileNav',
        'FormDispatcher',
        'SecurityShield',
        'initApp'
      ]
    }).getObfuscatedCode();

    fs.writeFileSync(mainJsPath, obfuscated, 'utf8');
    console.log(`  🛡️ [PASS] assets/js/main.js encrypted & obfuscated successfully (${obfuscated.length} bytes)`);
  } else {
    console.warn(`  ⚠️ javascript-obfuscator not found, fallback to combined raw main.js`);
    fs.writeFileSync(mainJsPath, combinedJs, 'utf8');
  }
} catch (err) {
  console.error('  ❌ Error building main.js:', err.message || err);
  errorCount++;
}

// ─────────────────────────────────────────────────────────────────────────
// [5/6] 校验 main.dev.js 模块集成与 main.js 混淆语法完整性
// ─────────────────────────────────────────────────────────────────────────
console.log('\n🧠 [5/6] Verifying Namespace Integrity & Obfuscated Syntax...');
const devJs = fs.readFileSync(mainDevJsPath, 'utf8');
const namespaceChecks = [
  { name: 'window.LingYun namespace definition', ok: devJs.includes('window.LingYun = window.LingYun || {}') },
  { name: 'ENGINE_CONFIG registration', ok: devJs.includes('window.LingYun.ENGINE_CONFIG = ENGINE_CONFIG') },
  { name: 'UnifiedScrollEngine registration', ok: devJs.includes('window.LingYun.UnifiedScrollEngine = UnifiedScrollEngine') },
  { name: 'TickerLifecycle registration', ok: devJs.includes('window.LingYun.TickerLifecycle = TickerLifecycle') },
  { name: 'F1TiltEngine registration', ok: devJs.includes('window.LingYun.F1TiltEngine = F1TiltEngine') },
  { name: 'CarTelemetryHUD registration', ok: devJs.includes('window.LingYun.CarTelemetryHUD = CarTelemetryHUD') },
  { name: 'CarSpecTabs registration', ok: devJs.includes('window.LingYun.CarSpecTabs = CarSpecTabs') },
  { name: 'ScrollRevealEngine registration', ok: devJs.includes('window.LingYun.ScrollRevealEngine = ScrollRevealEngine') },
  { name: 'TelemetryCounters registration', ok: devJs.includes('window.LingYun.TelemetryCounters = TelemetryCounters') },
  { name: 'CountdownTimer registration', ok: devJs.includes('window.LingYun.CountdownTimer = CountdownTimer') },
  { name: 'ActivityFilters registration', ok: devJs.includes('window.LingYun.ActivityFilters = ActivityFilters') },
  { name: 'ModalEngine registration', ok: devJs.includes('window.LingYun.ModalEngine = ModalEngine') },
  { name: 'MobileNav registration', ok: devJs.includes('window.LingYun.MobileNav = MobileNav') },
  { name: 'FormDispatcher registration', ok: devJs.includes('window.LingYun.FormDispatcher = FormDispatcher') },
  { name: 'SecurityShield registration', ok: devJs.includes('window.LingYun.SecurityShield = SecurityShield') },
  { name: 'initApp registration', ok: devJs.includes('window.LingYun.initApp = initApp') }
];

namespaceChecks.forEach(c => {
  if (c.ok) {
    console.log(`  ✅ [PASS] ${c.name}`);
  } else {
    console.error(`  ❌ [FAIL] ${c.name}`);
    errorCount++;
  }
});

// 验证混淆后生成的 main.js 语法无误
try {
  execSync(`node -c "${mainJsPath}"`);
  console.log(`  ✅ [PASS] Encrypted main.js syntax check passed`);
} catch (e) {
  console.error(`  ❌ main.js has syntax errors:`, e.message);
  errorCount++;
}

// ─────────────────────────────────────────────────────────────────────────
// [6/6] 校验 index.html 模块架构语义与文案合规
// ─────────────────────────────────────────────────────────────────────────
console.log('\n📄 [6/6] Verifying index.html Semantic Modules & Compliance...');
const html = fs.readFileSync(htmlPath, 'utf8');
const htmlChecks = [
  { name: 'Main wrapper (<main id="main-content">)', ok: html.includes('<main id="main-content">') },
  { name: 'Module: Top Ticker (data-module="top-ticker")', ok: html.includes('data-module="top-ticker"') },
  { name: 'Module: Navigation (data-module="navigation")', ok: html.includes('data-module="navigation"') },
  { name: 'Module: Hero (data-module="hero")', ok: html.includes('data-module="hero"') },
  { name: 'Module: About (data-module="about")', ok: html.includes('data-module="about"') },
  { name: 'Module: Dual Pillars (data-module="dual-pillars")', ok: html.includes('data-module="dual-pillars"') },
  { name: 'Module: Machinery (data-module="machinery")', ok: html.includes('data-module="machinery"') },
  { name: 'Module: Milestones (data-module="milestones")', ok: html.includes('data-module="milestones"') },
  { name: 'Module: Activities (data-module="activities")', ok: html.includes('data-module="activities"') },
  { name: 'Module: Recruitment (data-module="recruitment")', ok: html.includes('data-module="recruitment"') },
  { name: 'Module: Sponsorship (data-module="sponsorship")', ok: html.includes('data-module="sponsorship"') },
  { name: 'Module: Contact (data-module="contact")', ok: html.includes('data-module="contact"') },
  { name: 'Module: Footer (data-module="footer")', ok: html.includes('data-module="footer"') },
  { name: 'Module: Modals (data-module="modals")', ok: html.includes('data-module="modals"') }
];

htmlChecks.forEach(c => {
  if (c.ok) {
    console.log(`  ✅ [PASS] ${c.name}`);
  } else {
    console.error(`  ❌ [FAIL] ${c.name}`);
    errorCount++;
  }
});

// 违禁词检测 (检测 index.html 与 main.dev.js)
const forbiddenWords = ['襄阳', '800 ㎡', '校外练车场地', '三大科技团队之一'];
forbiddenWords.forEach(word => {
  if (html.includes(word) || devJs.includes(word)) {
    console.error(`  ❌ FORBIDDEN WORD FOUND: "${word}"`);
    errorCount++;
  }
});

console.log('\n================================================================');
if (errorCount === 0) {
  console.log('🏁 ALL MODULES VERIFIED, ENCRYPTED & BUILT SUCCESSFULLY!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 Build completed with ${errorCount} error(s)!`);
  console.log('================================================================\n');
  process.exit(1);
}
