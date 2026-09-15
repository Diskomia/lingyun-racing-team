/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 09 - ActivityFilters (赛事动态与工程纪实分类筛选及动态渲染系统)
 * =========================================================================
 */

'use strict';

(function(global) {
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const ActivityFilters = {
    renderDynamicCards() {
      const grid = document.getElementById('activity-grid');
      if (!grid) return;

      const mgr = (global.LingYun && global.LingYun.SiteConfigManager) || global.SiteConfigManager;
      if (!mgr) return;

      const config = mgr.load();
      if (!config || !Array.isArray(config.activities) || !config.activities.length) return;

      // 如果有自定义赛道纪实配置，动态渲染
      let html = '';
      config.activities.forEach(act => {
        const cat = act.category || 'race';
        const tagColor = act.tagColor || (cat === 'race' ? 'bg-[#D9232D]' : 'bg-[#103A82]');
        const icon = act.badgeIcon || (cat === 'race' ? 'trophy' : (cat === 'tech' ? 'wrench' : 'book-open'));
        const hoverColor = cat === 'race' ? 'hover:border-[#D9232D]/40 group-hover:text-[#D9232D]' : 'hover:border-[#103A82]/40 group-hover:text-[#103A82]';

        html += `
          <div class="activity-card glass-card rounded-xl overflow-hidden border border-black/[0.06] ${hoverColor} transition-all group flex flex-col bg-white shadow-sm"
               data-category="${escapeAttr(cat)}"
               data-stats="${escapeAttr(act.stats || '')}"
               data-full-text="${escapeAttr(act.fullText || act.summary || '')}">
            <div class="flex-1 flex flex-col">
              <div class="relative h-52 overflow-hidden">
                <img src="${escapeAttr(act.image || 'assets/images/track_action_card.jpg')}"
                     alt="${escapeAttr(act.title)}"
                     loading="lazy"
                     decoding="async"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="activity-tag absolute top-3 left-3 ${tagColor} text-white font-telemetry font-semibold text-[10px] px-2.5 py-1 rounded shadow-sm">
                  ${escapeHtml(act.tag || '赛道纪实')}
                </span>
                <span class="activity-date absolute bottom-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-zinc-700 font-telemetry text-xs shadow-sm">
                  ${escapeHtml(act.date || '2026')}
                </span>
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="activity-title font-display font-medium text-base text-zinc-900 transition-colors">
                    ${escapeHtml(act.title)}
                  </h3>
                  <p class="activity-summary text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed font-light">
                    ${escapeHtml(act.summary)}
                  </p>
                </div>
                <div class="mt-5 pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <span class="text-xs font-telemetry text-[#103A82] flex items-center gap-1 font-semibold">
                    <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
                    ${escapeHtml(act.badge || '赛报纪实')}
                  </span>
                  <button class="btn-open-activity text-xs text-zinc-700 hover:text-zinc-900 font-semibold flex items-center gap-1 cursor-pointer">
                    赛报复盘 <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      grid.innerHTML = html;
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    },

    bindFilterEvents() {
      const filterBtns = document.querySelectorAll('.activity-filter-btn');
      const cards = Array.from(document.querySelectorAll('.activity-card'));
      if (!filterBtns.length || !cards.length) return;

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-filter');

          filterBtns.forEach(b => {
            b.classList.remove('bg-[#D9232D]', 'text-white', 'border-[#D9232D]', 'shadow-sm');
            b.classList.add('bg-white', 'text-zinc-600', 'border-zinc-200');
          });
          btn.classList.remove('bg-white', 'text-zinc-600', 'border-zinc-200');
          btn.classList.add('bg-[#D9232D]', 'text-white', 'border-[#D9232D]', 'shadow-sm');

          const currentCards = Array.from(document.querySelectorAll('.activity-card'));
          currentCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.classList.remove('hidden');
              card.classList.add('item-fade-in');
            } else {
              card.classList.add('hidden');
              card.classList.remove('item-fade-in');
            }
          });
        });
      });
    },

    init() {
      // 检查是否具备动态配置并渲染
      try {
        const mgr = (global.LingYun && global.LingYun.SiteConfigManager) || global.SiteConfigManager;
        if (mgr) {
          const cfg = mgr.load();
          if (cfg && cfg.activities && cfg.activities.length) {
            this.renderDynamicCards();
          }
        }
      } catch (_) {}

      this.bindFilterEvents();

      // 监听跨页面或云端配置更新
      if (typeof window !== 'undefined') {
        window.addEventListener('ly_config_updated', () => {
          this.renderDynamicCards();
          this.bindFilterEvents();
        });
        window.addEventListener('storage', (e) => {
          if (e.key === 'ly_site_config_v2') {
            this.renderDynamicCards();
            this.bindFilterEvents();
          }
        });
      }
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.ActivityFilters = ActivityFilters;

  // 向后兼容全局作用域
  global.ActivityFilters = ActivityFilters;
})(typeof window !== 'undefined' ? window : this);
