/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 03 - F1TiltEngine (3D 物理视差微倾角引擎与显存生命周期)
 * =========================================================================
 */

'use strict';

(function(global) {
  var F1TiltEngine = {
    init: function() {
      // 移动端、触屏或开启系统级减弱动态效果时禁用 3D 微倾角，避免触摸滚动卡顿或跳变
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      var cards = document.querySelectorAll('.tilt-card');
      if (!cards.length) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((global.LingYun && global.LingYun.ENGINE_CONFIG) || global.ENGINE_CONFIG || {
          tilt: { defaultMax: 6.0, subtleMax: 3.2, defaultZ: 8, subtleZ: 4, perspective: 1000 }
        });

      cards.forEach(function(card) {
        var inner = card.querySelector('.tilt-inner') || card;
        var bounds = null;
        var frameId = null;

        // 读取卡片自定义的最大偏转角 (如技术/商业大标签设定为 3.2 度)
        var cardMaxTilt = parseFloat(card.getAttribute('data-tilt-max')) || config.tilt.defaultMax;
        var cardZDepth = card.hasAttribute('data-tilt-max') ? config.tilt.subtleZ : config.tilt.defaultZ;

        function updateBounds() {
          bounds = card.getBoundingClientRect();
        }

        function handleMouseMove(e) {
          if (!bounds) updateBounds();
          var mouseX = e.clientX - bounds.left;
          var mouseY = e.clientY - bounds.top;
          var xRatio = mouseX / bounds.width;
          var yRatio = mouseY / bounds.height;

          // 取消前一个尚未绘制的帧，防止事件积压引发掉帧
          if (frameId) cancelAnimationFrame(frameId);

          frameId = requestAnimationFrame(function() {
            var tiltX = (0.5 - yRatio) * (cardMaxTilt * 2);
            var tiltY = (xRatio - 0.5) * (cardMaxTilt * 2);

            inner.style.transform = 'perspective(' + config.tilt.perspective + 'px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + tiltY.toFixed(2) + 'deg) translate3d(0, -' + cardZDepth + 'px, ' + (cardZDepth * 1.5) + 'px)';
            inner.style.setProperty('--mouse-x', (xRatio * 100).toFixed(1) + '%');
            inner.style.setProperty('--mouse-y', (yRatio * 100).toFixed(1) + '%');
          });
        }

        function handleMouseEnter() {
          updateBounds();
          inner.style.willChange = 'transform';
        }

        function handleMouseLeave() {
          if (frameId) cancelAnimationFrame(frameId);
          inner.style.transform = 'perspective(' + config.tilt.perspective + 'px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
          inner.style.willChange = 'auto';
          bounds = null;
        }

        card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        card.addEventListener('mousemove', handleMouseMove, { passive: true });
        card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      });
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.F1TiltEngine = F1TiltEngine;

  // 向后兼容全局作用域
  global.F1TiltEngine = F1TiltEngine;
})(typeof window !== 'undefined' ? window : this);
