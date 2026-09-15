/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 05 - CarSpecTabs (赛车 5 大专业规格面板切换系统与数字化仿真)
 * =========================================================================
 */

'use strict';

(function(global) {
  const CarSpecTabs = {
    init() {
      const tabs = document.querySelectorAll('.car-spec-tab');
      const panels = document.querySelectorAll('.car-spec-panel');
      if (!tabs.length || !panels.length) return;

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-target');

          tabs.forEach(t => {
            t.classList.remove('bg-[#D9232D]', 'text-white', 'border-[#D9232D]', 'shadow-sm');
            t.classList.add('bg-gray-100', 'text-zinc-600', 'border-zinc-200');
          });
          tab.classList.remove('bg-gray-100', 'text-zinc-600', 'border-zinc-200');
          tab.classList.add('bg-[#D9232D]', 'text-white', 'border-[#D9232D]', 'shadow-sm');

          panels.forEach(p => {
            if (p.id === targetId) {
              p.classList.remove('hidden');
              p.classList.add('item-fade-in');
            } else {
              p.classList.add('hidden');
              p.classList.remove('item-fade-in');
            }
          });
        });
      });
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.CarSpecTabs = CarSpecTabs;

  // 向后兼容全局作用域
  global.CarSpecTabs = CarSpecTabs;
})(typeof window !== 'undefined' ? window : this);
