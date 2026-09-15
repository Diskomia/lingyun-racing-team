/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 02 - TickerLifecycle (跑马灯视口外智能休眠与能耗管理引擎)
 * =========================================================================
 */

'use strict';

(function(global) {
  const TickerLifecycle = {
    init() {
      const wrap = document.querySelector('.telemetry-ticker-wrap');
      const track = document.querySelector('.telemetry-ticker-track');
      if (!wrap || !track || !window.IntersectionObserver) return;

      const observer = new IntersectionObserver(([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      }, { threshold: 0 });

      observer.observe(wrap);
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.TickerLifecycle = TickerLifecycle;

  // 向后兼容全局作用域
  global.TickerLifecycle = TickerLifecycle;
})(typeof window !== 'undefined' ? window : this);
