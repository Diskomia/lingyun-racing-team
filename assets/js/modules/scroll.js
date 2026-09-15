/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 01 - UnifiedScrollEngine (统一滚动调度与布局指标缓存引擎)
 * =========================================================================
 */

'use strict';

(function(global) {
  const UnifiedScrollEngine = {
    progressBar: null,
    navbar: null,
    backToTopBtn: null,
    sections: [],
    navLinks: [],
    mobileNavLinks: [],
    ticking: false,

    init() {
      this.progressBar = document.getElementById('track-progress-bar');
      this.navbar = document.getElementById('main-nav');
      this.backToTopBtn = document.getElementById('back-to-top-btn');
      this.sections = Array.from(document.querySelectorAll('section[id]'));
      this.navLinks = Array.from(document.querySelectorAll('.nav-link, #desktop-nav-links a'));
      this.mobileNavLinks = Array.from(document.querySelectorAll('.mobile-nav-link, #mobile-menu a'));

      // 绑定单一被动滚动监听器
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });

      // 窗口尺寸缩放时防抖重新计算
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.onScroll(), 150);
      }, { passive: true });

      // 回到顶部
      if (this.backToTopBtn) {
        this.backToTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // 初次校准
      this.onScroll();

      // 页面完全加载后重新校准一次（图片加载完后位置会变）
      window.addEventListener('load', () => {
        setTimeout(() => this.onScroll(), 300);
      });
    },

    onScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
            ((global.LingYun && global.LingYun.ENGINE_CONFIG) || global.ENGINE_CONFIG || {
              scroll: { navbarThreshold: 40, backToTopThreshold: 280 }
            });

          // 进度条
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - document.documentElement.clientHeight);
          if (this.progressBar) {
            const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
            this.progressBar.style.transform = `scaleX(${progress})`;
          }

          // 导航栏样式
          if (this.navbar) {
            if (scrollY > config.scroll.navbarThreshold) {
              this.navbar.classList.add('shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)]', 'bg-white/95');
              this.navbar.classList.remove('bg-white/85');
            } else {
              this.navbar.classList.remove('shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)]', 'bg-white/95');
              this.navbar.classList.add('bg-white/85');
            }
          }

          // 回到顶部按钮
          if (this.backToTopBtn) {
            if (scrollY > config.scroll.backToTopThreshold) {
              this.backToTopBtn.classList.add('visible');
            } else {
              this.backToTopBtn.classList.remove('visible');
            }
          }

          // ScrollSpy: 实时计算当前 section
          if (this.sections.length && (this.navLinks.length || this.mobileNavLinks.length)) {
            const navLine = 150; // 导航栏下方 150px 判定线
            let currentSectionId = '';
            for (const sec of this.sections) {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= navLine) {
                currentSectionId = sec.id;
              }
            }
            if (currentSectionId) {
              this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
              this.mobileNavLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          }

          this.ticking = false;
        });
        this.ticking = true;
      }
    }
  };

  global.LingYun = global.LingYun || {};
  global.LingYun.UnifiedScrollEngine = UnifiedScrollEngine;
  global.UnifiedScrollEngine = UnifiedScrollEngine;
})(typeof window !== 'undefined' ? window : this);
