/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 08 - CountdownTimer (2026 FSC 全国总决赛 Pit-Board 倒计时与视口休眠)
 * =========================================================================
 */

'use strict';

(function(global) {
  var CountdownTimer = {
    init: function() {
      var daysEl = document.getElementById('count-days');
      var hoursEl = document.getElementById('count-hours');
      var minutesEl = document.getElementById('count-mins');
      var secondsEl = document.getElementById('count-secs');
      var labelEl = document.getElementById('count-label');
      if (!daysEl) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((global.LingYun && global.LingYun.ENGINE_CONFIG) || global.ENGINE_CONFIG || {});

      // 2026 中国大学生方程式汽车大赛 (FSC) 拟定时间：2026年11月3日至8日 (兼顾跨浏览器时区解析健壮性)
      var startStr = (config.competition && config.competition.startDate) || '2026-11-03T09:00:00+08:00';
      var endStr = (config.competition && config.competition.endDate) || '2026-11-08T18:00:00+08:00';

      var startTime = new Date(startStr).getTime();
      if (isNaN(startTime)) {
        startTime = new Date(2026, 10, 3, 9, 0, 0).getTime();
      }
      var endTime = new Date(endStr).getTime();
      if (isNaN(endTime)) {
        endTime = new Date(2026, 10, 8, 18, 0, 0).getTime();
      }

      function update() {
        var now = Date.now();
        var distance = startTime - now;

        if (isNaN(distance)) return;

        // 距离开幕倒计时已结束
        if (distance <= 0) {
          var remainingCompetition = endTime - now;
          if (remainingCompetition > 0) {
            // 赛期进行中 (2026.11.03 - 11.08)
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            if (labelEl) {
              labelEl.innerHTML = '<span class="text-emerald-600 font-semibold">● 正赛激战进行中</span><br><span class="text-[10px] font-telemetry text-zinc-400">2026 FSC 全国总决赛</span>';
            }
          } else {
            // 赛期结束收官
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            if (labelEl) {
              labelEl.innerHTML = '<span class="text-zinc-700 font-semibold">2026 赛季圆满完赛收官</span><br><span class="text-[10px] font-telemetry text-zinc-400">凌云油车队 凯旋</span>';
            }
          }
          return;
        }

        // 实时换算天、时、分、秒
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(mins).padStart(2, '0');
        secondsEl.textContent = String(secs).padStart(2, '0');
      }

      // 智能视口感知：离屏时挂起定时器，入屏时立即唤醒校准，避免无意义主线程唤醒
      var timerId = null;
      function startCountdown() {
        if (!timerId) {
          update();
          timerId = setInterval(update, 1000);
        }
      }
      function stopCountdown() {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
      }

      var container = daysEl.closest('.pit-digit-box');
      container = container ? container.parentElement : daysEl;
      if (container && window.IntersectionObserver) {
        var observer = new IntersectionObserver(function(entries) {
          var entry = entries[0];
          if (entry.isIntersecting) {
            startCountdown();
          } else {
            stopCountdown();
          }
        });
        observer.observe(container);
      } else {
        startCountdown();
      }

      // 实时响应管理后台配置变更 (热重载无需整页刷新)
      if (typeof window !== 'undefined') {
        window.addEventListener('ly_config_updated', function(e) {
          var cfg = e && e.detail;
          if (cfg && cfg.site && cfg.site.countdownDate) {
            var newTime = new Date(cfg.site.countdownDate).getTime();
            if (!isNaN(newTime)) {
              startTime = newTime;
              update();
            }
          }
        });
      }
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.CountdownTimer = CountdownTimer;

  // 向后兼容全局作用域
  global.CountdownTimer = CountdownTimer;
})(typeof window !== 'undefined' ? window : this);
