/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 12 - MobileNav (移动端折叠导航抽屉中枢)
 * =========================================================================
 */

'use strict';

(function(global) {
  const MobileNav = {
    init() {
      const toggleBtn = document.getElementById('mobile-menu-btn');
      const menu = document.getElementById('mobile-menu');
      if (!toggleBtn || !menu) return;

      const setMenuOpen = (open) => {
        if (open) {
          menu.classList.remove('hidden');
          toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
          menu.classList.add('hidden');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      };

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isClosed = menu.classList.contains('hidden');
        setMenuOpen(isClosed);
      });

      const links = menu.querySelectorAll('a');
      links.forEach(l => {
        l.addEventListener('click', () => setMenuOpen(false));
      });

      // 点击菜单外部自动平滑收起
      document.addEventListener('click', (e) => {
        if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !toggleBtn.contains(e.target)) {
          setMenuOpen(false);
        }
      });

      // 屏幕宽度切换到桌面端 (>= 1024px) 时自动关闭移动端抽屉
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && !menu.classList.contains('hidden')) {
          setMenuOpen(false);
        }
      }, { passive: true });
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.MobileNav = MobileNav;

  // 向后兼容全局作用域
  global.MobileNav = MobileNav;
})(typeof window !== 'undefined' ? window : this);
