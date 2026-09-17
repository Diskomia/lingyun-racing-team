/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 13 - AppBootstrap (全站各子系统统一挂载协调中枢)
 * =========================================================================
 *
 * 错误边界机制：每个模块的 init() 调用被独立 try/catch 隔离，
 * 任何单一模块初始化失败不会阻断其余模块正常启动。
 * 所有异常通过 LYDebug 记录，可通过 LingYun.debug.dump() 查看。
 */

'use strict';

(function(global) {
  function initApp() {
    const debug = (global.LingYun && global.LingYun.debug) || global.LYDebug || {
      log: () => {},
      warn: () => {},
      error: (m, msg, e) => console.error(`[${m}] ${msg}`, e)
    };

    // 安全初始化 Lucide 矢量图标
    if (global.lucide) {
      try {
        global.lucide.createIcons();
        debug.log('bootstrap', 'Lucide icons initialized');
      } catch (err) {
        debug.error('bootstrap', 'Lucide createIcons failed', err);
      }
    }

    // 错误边界挂载执行器：隔离单模块异常，保障整体页面交互可用性
    const mount = (name, fn) => {
      try {
        fn();
        debug.log(name, 'initialized');
      } catch (err) {
        debug.error(name, 'init failed', err);
      }
    };

    function applyDynamicContent() {
      try {
        const mgr = (global.LingYun && global.LingYun.SiteConfigManager) || global.SiteConfigManager;
        if (!mgr) return;
        const config = mgr.load();
        if (!config) return;

        // 0. 动态渲染顶部跑马灯遥测数据流 (Top Ticker)
        const tickerWrap = document.querySelector('.telemetry-ticker-wrap');
        const tickerTrack = document.querySelector('.telemetry-ticker-track');
        if (tickerWrap && tickerTrack && config.site) {
          if (config.site.tickerEnabled === false) {
            tickerWrap.style.display = 'none';
          } else {
            tickerWrap.style.display = '';
            
            // 速度控制
            if (config.site.tickerSpeed) {
              tickerTrack.style.animationDuration = `${config.site.tickerSpeed}s`;
            }

            // 组装 pills HTML
            let pillsHtml = '';
            
            // 置顶广播通告
            if (config.site.tickerText && config.site.tickerText.trim()) {
              pillsHtml += `
                <div class="telemetry-pill bg-[#103A82]/5 text-[#103A82]">
                  <span class="w-2 h-2 rounded-full bg-[#D9232D] animate-pulse"></span>
                  <span class="font-bold text-[#D9232D]">📢 车队通告:</span>
                  <span class="val font-semibold text-zinc-900">${config.site.tickerText.trim()}</span>
                </div>
              `;
            }

            // 数据条目列表
            const items = Array.isArray(config.site.tickerItems) && config.site.tickerItems.length
              ? config.site.tickerItems
              : (mgr.DEFAULT_CONFIG && mgr.DEFAULT_CONFIG.site && mgr.DEFAULT_CONFIG.site.tickerItems);

            if (items && items.length) {
              items.forEach((item, idx) => {
                const isFirst = idx === 0 && (!config.site.tickerText || !config.site.tickerText.trim());
                const pulseDot = (item.pulse || isFirst) ? `<span class="w-2 h-2 rounded-full bg-[#103A82] animate-pulse"></span>` : '';
                const valClass = item.color ? `val ${item.color} font-bold` : (item.highlight ? 'highlight' : 'val');
                pillsHtml += `
                  <div class="telemetry-pill">
                    ${pulseDot}
                    <span>${item.label || item.prefix || ''}:</span>
                    <span class="${valClass}">${item.val || item.value || ''}</span>
                  </div>
                `;
              });
            }

            if (pillsHtml) {
              tickerTrack.innerHTML = `
                <div class="flex items-center">${pillsHtml}</div>
                <div class="flex items-center">${pillsHtml}</div>
              `;
            }
          }
        }

        // 1. 动态同步倒计时赛期、主标题与拟定赛期文案
        if (config.site) {
          if (config.site.countdownDate && global.LingYun && global.LingYun.ENGINE_CONFIG) {
            global.LingYun.ENGINE_CONFIG.competition = global.LingYun.ENGINE_CONFIG.competition || {};
            if (config.site.countdownTitle) global.LingYun.ENGINE_CONFIG.competition.name = config.site.countdownTitle;
            global.LingYun.ENGINE_CONFIG.competition.startDate = config.site.countdownDate;
          }
          const titleEl = document.getElementById('count-title-text');
          if (titleEl && config.site.countdownLabel) {
            titleEl.textContent = config.site.countdownLabel;
          }
          const periodEl = document.getElementById('count-period-text');
          if (periodEl && config.site.countdownPeriod) {
            periodEl.textContent = config.site.countdownPeriod;
          }

          // 2. 动态同步当前研发/备赛状态与指示灯
          if (config.site.currentStatus) {
            const statusEl = document.getElementById('season-status-text');
            if (statusEl) statusEl.textContent = config.site.currentStatus;
            const milestoneStatusEl = document.getElementById('milestone-current-status');
            if (milestoneStatusEl) milestoneStatusEl.textContent = config.site.currentStatus;
          }
          if (config.site.currentLocation) {
            const locEl = document.getElementById('season-status-location');
            if (locEl) locEl.textContent = config.site.currentLocation;
          }
          if (config.site.currentStatusColor) {
            const dotEl = document.getElementById('season-status-dot');
            if (dotEl) {
              const colorMap = {
                emerald: 'bg-emerald-500',
                amber: 'bg-amber-500',
                blue: 'bg-[#103A82]',
                red: 'bg-[#D9232D]'
              };
              const newColorClass = colorMap[config.site.currentStatusColor] || 'bg-emerald-500';
              dotEl.className = `w-2 h-2 rounded-full ${newColorClass} animate-pulse`;
            }
          }
        }

        // 3. 动态更新基地地址与各处邮箱
        if (config.site && config.site.workshopAddress) {
          document.querySelectorAll('.dynamic-address').forEach(el => el.textContent = config.site.workshopAddress);
        }

        // 4. 动态更新招新状态通知
        if (config.recruitment && !config.recruitment.isOpen) {
          document.querySelectorAll('.recruitment-status-pill').forEach(el => {
            el.textContent = '● 招募暂未开启';
            el.className = el.className.replace(/text-emerald-\d+/, 'text-amber-600').replace(/bg-emerald-\d+/, 'bg-amber-100');
          });
        }
      } catch (err) {
        debug.error('bootstrap', 'applyDynamicContent error', err);
      }
    }

    // 监听全站配置更新与跨页面广播，实现零刷新热更新
    if (typeof window !== 'undefined') {
      window.addEventListener('ly_config_updated', applyDynamicContent);
      window.addEventListener('storage', (e) => {
        if (e.key === 'ly_site_config_v2') applyDynamicContent();
      });
    }

    // 顺序挂载各大核心子系统 (带独立错误边界)
    mount('UnifiedScrollEngine', () => UnifiedScrollEngine.init());
    mount('TickerLifecycle',      () => TickerLifecycle.init());
    mount('F1TiltEngine',         () => F1TiltEngine.init());
    mount('CarTelemetryHUD',      () => CarTelemetryHUD.init());
    mount('CarSpecTabs',          () => CarSpecTabs.init());
    mount('ScrollRevealEngine',   () => ScrollRevealEngine.init());
    mount('TelemetryCounters',    () => TelemetryCounters.init());
    mount('CountdownTimer',       () => CountdownTimer.init());
    mount('ActivityFilters',      () => ActivityFilters.init());
    mount('ModalEngine',          () => ModalEngine.init());
    mount('MobileNav',            () => MobileNav.init());
    mount('FormDispatcher',       () => FormDispatcher.init());
    mount('SecurityShield',       () => SecurityShield.init());
    mount('DynamicContent',       () => applyDynamicContent());

    if (typeof window !== 'undefined') {
      window.addEventListener('ly_config_updated', () => applyDynamicContent());
      // 异步从 GAS 云端拉取最新全站配置 (优先级最高，换浏览器也能看到)
      const mgr = (global.LingYun && global.LingYun.SiteConfigManager) || global.SiteConfigManager;
      const gasUrl = 'https://script.google.com/macros/s/AKfycbxokikkqxMlEYXQr2RAbHU218VagoeyxxmaAAW-ngcioI3PdcO7b7zugckuTcROxvWdLg/exec';
      if (mgr && typeof mgr.fetchCloudConfig === 'function') {
        mgr.fetchCloudConfig(gasUrl);
      }
      // 再从仓库 config.json 拉取 (兜底)
      if (mgr && typeof mgr.fetchRepoConfig === 'function') {
        mgr.fetchRepoConfig();
      }
    }

    debug.log('bootstrap', 'All core subsystems mounted');
  }

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.initApp = initApp;

  // 页面 DOM 就绪即刻初始化
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }

    // 资源加载完成再次核验图标完整性
    window.addEventListener('load', () => {
      if (global.lucide) {
        try {
          global.lucide.createIcons();
        } catch (e) {
          // 静默处理
        }
      }
    });
  }
})(typeof window !== 'undefined' ? window : this);
