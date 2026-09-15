/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 11 - ToastSystem & DeckDownload (通知系统与商业赞助手册下载)
 * =========================================================================
 */

'use strict';

(function(global) {
  function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = 'pointer-events-auto transform transition-all duration-300 translate-y-4 opacity-0 p-4 rounded-xl toast-card flex items-start gap-3.5 shadow-xl max-w-sm sm:max-w-md';

    toast.innerHTML = `
      <div class="mt-0.5 shrink-0 ${isSuccess ? 'text-[#D9232D]' : 'text-[#103A82]'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="text-xs sm:text-sm font-medium leading-relaxed text-zinc-900">${message}</div>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function downloadSponsorshipDeck() {
    showToast('📄 正在启动下载《河北工程大学科信学院凌云油车队 2026 赛季 FSEC 商业赞助招商手册》高保真 PDF 商业画册...', 'success');
    const element = document.createElement('a');
    element.href = 'assets/docs/河北工程大学科信学院凌云油车队_2026赛季FSEC商业赞助招商手册.pdf';
    element.download = '河北工程大学科信学院凌云油车队_2026赛季FSEC商业赞助招商手册.pdf';
    element.target = '_blank';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.showToast = showToast;
  global.LingYun.downloadSponsorshipDeck = downloadSponsorshipDeck;

  // 显式挂载全局接口 (兼容现有 HTML onclick 与外部调用)
  global.showToast = showToast;
  global.downloadSponsorshipDeck = downloadSponsorshipDeck;
})(typeof window !== 'undefined' ? window : this);
