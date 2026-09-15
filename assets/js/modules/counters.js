/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 07 - TelemetryCounters (三次方缓出数值插值与脏值过滤计数器)
 * =========================================================================
 */

'use strict';

(function(global) {
  var TelemetryCounters = {
    init: function() {
      var counterElements = document.querySelectorAll('[data-counter-target]');
      if (!counterElements.length) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((global.LingYun && global.LingYun.ENGINE_CONFIG) || global.ENGINE_CONFIG || {
          telemetryDuration: 1500
        });

      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseFloat(el.getAttribute('data-counter-target'));
            if (isNaN(target)) return;

            var decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
            var prefix = el.getAttribute('data-counter-prefix') || '';
            var suffix = el.getAttribute('data-counter-suffix') || '';
            var duration = config.telemetryDuration || 1500;
            var startTime = performance.now();

            function animateCount(timestamp) {
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var easeOut = 1 - Math.pow(1 - progress, 3);
              var currentVal = easeOut * target;
              var formatted = prefix + currentVal.toFixed(decimals) + suffix;

              // 脏值比对过滤：避免高刷屏下数值未变时重复操作 DOM
              if (el.textContent !== formatted) {
                el.textContent = formatted;
              }

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                el.textContent = prefix + target.toFixed(decimals) + suffix;
              }
            }

            requestAnimationFrame(animateCount);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(function(el) { observer.observe(el); });
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.TelemetryCounters = TelemetryCounters;

  // 向后兼容全局作用域
  global.TelemetryCounters = TelemetryCounters;
})(typeof window !== 'undefined' ? window : this);
