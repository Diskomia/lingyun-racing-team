/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 06 - ScrollRevealEngine (视口交错平滑入场调度与图层释放引擎)
 * =========================================================================
 */

'use strict';

(function(global) {
  const ScrollRevealEngine = {
    init() {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (!revealElements.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      });

      revealElements.forEach(el => observer.observe(el));
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.ScrollRevealEngine = ScrollRevealEngine;

  // 向后兼容全局作用域
  global.ScrollRevealEngine = ScrollRevealEngine;
})(typeof window !== 'undefined' ? window : this);
