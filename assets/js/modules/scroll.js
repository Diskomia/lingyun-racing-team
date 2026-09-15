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
    sectionOffsets: [],
    maxScroll: 1,
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

      // 预先缓存各章节绝对高度与页面最大可滚动距离，避免滚动时逐帧调用 offsetTop / scrollHeight 引起 Forced Reflow
      this.cacheMetrics();

      // 绑定单一被动滚动监听器 (Passive Event Listener)
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });

      // 窗口尺寸缩放时防抖重新计算高度
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.cacheMetrics();
          this.onScroll();
        }, 120);
      }, { passive: true });

      // 绑定回到顶部点击事件
      if (this.backToTopBtn) {
        this.backToTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // 初次执行校准当前位置
      this.onScroll();

      // 等所有图片加载完后重新校准（第一次进入时图片未加载完会导致定位不准）
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.cacheMetrics();
          this.onScroll();
          // 如果 URL 有 hash，重新滚动到正确位置
          if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
              const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
              window.scrollTo({ top: top, behavior: 'instant' });
            }
          }
        }, 200);
      });

      // 也监听图片加载事件，每张图加载完都重新校准
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', () => {
            this.cacheMetrics();
            this.onScroll();
          });
        }
      });
    },

    cacheMetrics() {
      this.maxScroll = Math.max(1, document.documentElement.scrollHeight - document.documentElement.clientHeight);
      this.sectionOffsets = this.sections.map(sec => ({
        id: sec.id,
        top: sec.offsetTop
      }));
    },

    // 保持向后兼容旧测试断言
    cacheSectionOffsets() {
      this.cacheMetrics();
    },

    onScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
          const config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
            ((global.LingYun && global.LingYun.ENGINE_CONFIG) || global.ENGINE_CONFIG || {
              scroll: { navbarThreshold: 40, backToTopThreshold: 280 }
            });

          // 1.1 F1 赛道滚动进度条 (纯 GPU 硬件合成 scaleX，零重排零重绘)
          if (this.progressBar) {
            const progress = Math.min(1, Math.max(0, scrollY / this.maxScroll));
            this.progressBar.style.transform = `scaleX(${progress})`;
          }

          // 1.2 顶部导航栏动态通透度 / 阴影渐变 (Apple Light 现代毛玻璃)
          if (this.navbar) {
            if (scrollY > config.scroll.navbarThreshold) {
              this.navbar.classList.add('shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)]', 'bg-white/95');
              this.navbar.classList.remove('bg-white/85');
            } else {
              this.navbar.classList.remove('shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)]', 'bg-white/95');
              this.navbar.classList.add('bg-white/85');
            }
          }

          // 1.3 侧边回到顶部按键平滑显隐
          if (this.backToTopBtn) {
            if (scrollY > config.scroll.backToTopThreshold) {
              this.backToTopBtn.classList.add('visible');
            } else {
              this.backToTopBtn.classList.remove('visible');
            }
          }

          // 1.4 ScrollSpy: 实时动态高亮当前视口所在章节 (实时读取 getBoundingClientRect，避免图片加载后缓存偏移)
          if (this.sections.length && (this.navLinks.length || this.mobileNavLinks.length)) {
            const navLine = 120; // 导航栏底部下方约 30px 的判定线
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

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.UnifiedScrollEngine = UnifiedScrollEngine;

  // 向后兼容全局作用域
  global.UnifiedScrollEngine = UnifiedScrollEngine;
})(typeof window !== 'undefined' ? window : this);
