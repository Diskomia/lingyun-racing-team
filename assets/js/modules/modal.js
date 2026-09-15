/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 10 - ModalEngine (招募/赞助/活动弹窗中枢与无障碍焦点捕获引擎)
 * =========================================================================
 */

'use strict';

(function(global) {
  var ModalEngine = {
    lastFocusedElement: null,

    openModal: function(modal) {
      if (!modal) return;
      this.lastFocusedElement = document.activeElement;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      var card = modal.querySelector('.glass-panel');
      if (card) {
        card.classList.add('modal-card-anim');
        requestAnimationFrame(function() {
          card.classList.add('modal-visible');
        });
      }
      // 聚焦弹窗内首个交互元素
      requestAnimationFrame(function() {
        var focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      });
    },

    closeModal: function(modal) {
      if (!modal) return;
      var self = this;
      var card = modal.querySelector('.glass-panel');
      if (card) {
        card.classList.remove('modal-visible');
      }
      setTimeout(function() {
        modal.classList.add('hidden');
        // 当所有弹窗均关闭后，恢复背景页面滚动
        var openModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
        if (!openModals.length) {
          document.body.style.overflow = '';
        }
        // 恢复焦点至之前触发弹窗的元素
        if (self.lastFocusedElement && typeof self.lastFocusedElement.focus === 'function') {
          self.lastFocusedElement.focus();
          self.lastFocusedElement = null;
        }
      }, 160);
    },

    init: function() {
      this.initRecruitModal();
      this.initSponsorModal();
      this.initActivityModal();
      this.initAdminAuthModal();
      this.initReceiptModal();

      // 全局键盘监听 (ESC 关闭与 Tab 焦点锁定)
      var self = this;
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          var openModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
          openModals.forEach(function(m) { self.closeModal(m); });
        }

        if (e.key === 'Tab') {
          var openModal = document.querySelector('.modal-backdrop:not(.hidden)');
          if (!openModal) return;

          var focusables = Array.from(openModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
          if (!focusables.length) return;

          var first = focusables[0];
          var last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first || !openModal.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last || !openModal.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      });
    },

    initRecruitModal: function() {
      var modal = document.getElementById('recruit-modal');
      var openBtns = document.querySelectorAll('.btn-open-recruit');
      var closeBtns = document.querySelectorAll('.btn-close-recruit');
      var form = document.getElementById('recruit-form');
      var roleSelect = document.getElementById('recruit-role');
      var self = this;

      if (!modal) return;

      openBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var preselectedRole = btn.getAttribute('data-role');
          if (preselectedRole && roleSelect) {
            roleSelect.value = preselectedRole;
          }
          self.openModal(modal);
        });
      });

      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { self.closeModal(modal); });
      });

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var dispatcher = (typeof FormDispatcher !== 'undefined') ? FormDispatcher :
            (global.FormDispatcher || (global.LingYun && global.LingYun.FormDispatcher));
          if (dispatcher && typeof dispatcher.handleRecruitSubmit === 'function') {
            dispatcher.handleRecruitSubmit(form, modal);
          } else {
            var toastFn = (typeof showToast !== 'undefined') ? showToast :
              (global.showToast || (global.LingYun && global.LingYun.showToast));
            if (typeof toastFn === 'function') {
              toastFn('🎉 招新申请已提交！车队技术总监与人事组将在 3 个工作日内向您的邮箱发送初试函。', 'success');
            }
            form.reset();
            self.closeModal(modal);
          }
        });
      }

      modal.addEventListener('click', function(e) {
        if (e.target === modal) self.closeModal(modal);
      });
    },

    initSponsorModal: function() {
      var modal = document.getElementById('sponsor-modal');
      var openBtns = document.querySelectorAll('.btn-open-sponsor');
      var closeBtns = document.querySelectorAll('.btn-close-sponsor');
      var form = document.getElementById('sponsor-form');
      var tierSelect = document.getElementById('sponsor-tier-select');
      var self = this;

      if (!modal) return;

      openBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var preselectedTier = btn.getAttribute('data-tier');
          if (preselectedTier && tierSelect) {
            tierSelect.value = preselectedTier;
          }
          self.openModal(modal);
        });
      });

      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { self.closeModal(modal); });
      });

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var dispatcher = (typeof FormDispatcher !== 'undefined') ? FormDispatcher :
            (global.FormDispatcher || (global.LingYun && global.LingYun.FormDispatcher));
          if (dispatcher && typeof dispatcher.handleSponsorSubmit === 'function') {
            dispatcher.handleSponsorSubmit(form, modal);
          } else {
            var toastFn = (typeof showToast !== 'undefined') ? showToast :
              (global.showToast || (global.LingYun && global.LingYun.showToast));
            if (typeof toastFn === 'function') {
              toastFn('🏁 赞助意向已确认！车队商务总监将携带《2026商业白皮书完整版》在 24 小时内与您联系。', 'success');
            }
            form.reset();
            self.closeModal(modal);
          }
        });
      }

      modal.addEventListener('click', function(e) {
        if (e.target === modal) self.closeModal(modal);
      });
    },

    initActivityModal: function() {
      var modal = document.getElementById('activity-modal');
      var openBtns = document.querySelectorAll('.btn-open-activity');
      var closeBtns = document.querySelectorAll('.btn-close-activity');

      var mTitle = document.getElementById('act-modal-title');
      var mTag = document.getElementById('act-modal-tag');
      var mDate = document.getElementById('act-modal-date');
      var mText = document.getElementById('act-modal-text');
      var mImg = document.getElementById('act-modal-img');
      var mStats = document.getElementById('act-modal-stats');
      var self = this;

      if (!modal) return;

      var handleCardOpen = function(btn) {
        var card = btn.closest('.activity-card');
        if (!card) return;

        var titleEl = card.querySelector('.activity-title');
        var tagEl = card.querySelector('.activity-tag');
        var dateEl = card.querySelector('.activity-date');
        var summaryEl = card.querySelector('.activity-summary');
        var imgEl = card.querySelector('img');

        var title = titleEl ? titleEl.textContent.trim() : '活动详情';
        var tag = tagEl ? tagEl.textContent.trim() : '赛事纪实';
        var date = dateEl ? dateEl.textContent.trim() : '2026';
        var fullText = card.getAttribute('data-full-text') || (summaryEl ? summaryEl.textContent.trim() : '');
        var imgSrc = imgEl ? imgEl.getAttribute('src') : '';
        var stats = card.getAttribute('data-stats') || '';

        if (mTitle) mTitle.textContent = title;
        if (mTag) mTag.textContent = tag;
        if (mDate) mDate.textContent = date;
        if (mText) mText.textContent = fullText;

        if (mImg) {
          if (imgSrc) {
            mImg.src = imgSrc;
            var imgContainer = mImg.closest('.rounded-lg');
            if (imgContainer) imgContainer.classList.remove('hidden');
          } else {
            var imgContainer2 = mImg.closest('.rounded-lg');
            if (imgContainer2) imgContainer2.classList.add('hidden');
          }
        }

        if (mStats) {
          mStats.textContent = stats;
          var statsBox = mStats.closest('.p-3\\.5') || mStats.parentElement;
          if (statsBox) {
            if (stats && stats.trim()) {
              statsBox.classList.remove('hidden');
            } else {
              statsBox.classList.add('hidden');
            }
          }
        }

        self.openModal(modal);
      };

      // 委托模式监听动态生成的按钮
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.btn-open-activity');
        if (btn) {
          e.preventDefault();
          handleCardOpen(btn);
        }
      });

      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { self.closeModal(modal); });
      });

      modal.addEventListener('click', function(e) {
        if (e.target === modal) self.closeModal(modal);
      });
    },

    initAdminAuthModal: function() {
      var modal = document.getElementById('admin-auth-modal');
      var openBtn = document.getElementById('btn-open-admin-auth');
      var openBtnMobile = document.getElementById('btn-open-admin-auth-mobile');
      var closeBtns = modal ? modal.querySelectorAll('.btn-close-admin-auth') : [];
      var form = document.getElementById('admin-auth-form');
      var userInp = document.getElementById('admin-user');
      var passInp = document.getElementById('admin-pass');
      var passToggle = document.getElementById('admin-pass-toggle');
      var errorBox = document.getElementById('admin-auth-error');
      var errorMsg = document.getElementById('admin-auth-error-msg');
      var self = this;

      if (!modal) return;

      var openHandler = function(e) {
        if (e) e.preventDefault();
        var shield = (global.LingYun && global.LingYun.SecurityShield) || global.SecurityShield;
        if (shield && shield.AdminAuth && shield.AdminAuth.isAuthenticated()) {
          window.location.href = 'admin/';
          return;
        }
        if (errorBox) errorBox.classList.add('hidden');
        if (form) form.reset();
        self.openModal(modal);
        setTimeout(function() {
          if (userInp) userInp.focus();
        }, 120);
      };

      if (openBtn) openBtn.addEventListener('click', openHandler);
      if (openBtnMobile) openBtnMobile.addEventListener('click', openHandler);

      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { self.closeModal(modal); });
      });

      modal.addEventListener('click', function(e) {
        if (e.target === modal) self.closeModal(modal);
      });

      // 密码显隐切换
      if (passToggle && passInp) {
        passToggle.addEventListener('click', function(e) {
          e.preventDefault();
          var isPass = passInp.type === 'password';
          passInp.type = isPass ? 'text' : 'password';
          var icon = passToggle.querySelector('i');
          if (icon) {
            icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
          }
        });
      }

      // 提交身份验证
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var username = userInp ? userInp.value : '';
          var password = passInp ? passInp.value : '';

          var shield = (global.LingYun && global.LingYun.SecurityShield) || global.SecurityShield;
          if (shield && shield.AdminAuth) {
            var result = shield.AdminAuth.login(username, password);
            if (result.success) {
              if (errorBox) errorBox.classList.add('hidden');
              var submitBtn = document.getElementById('admin-auth-submit');
              if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>认证成功，正在进入管理中枢...</span></span>';
              }
              var toastFn = (typeof showToast !== 'undefined') ? showToast : (global.showToast || (global.LingYun && global.LingYun.showToast));
              if (typeof toastFn === 'function') {
                toastFn('🛡️ 认证成功！欢迎进入凌云油车队数据统筹中枢。', 'success');
              }
              setTimeout(function() {
                window.location.href = 'admin/';
              }, 400);
            } else {
              if (errorBox && errorMsg) {
                errorMsg.textContent = result.message || '账号或密码错误';
                errorBox.classList.remove('hidden');
              }
              if (passInp) {
                passInp.value = '';
                passInp.focus();
              }
            }
          }
        });
      }
    },

    /**
     * 初始化官方受理回执弹窗与交互 (复制文本、下载凭证)
     */
    initReceiptModal: function() {
      var modal = document.getElementById('submission-receipt-modal');
      var closeBtns = document.querySelectorAll('.btn-close-receipt');
      var copyBtn = document.getElementById('btn-copy-receipt');
      var downloadBtn = document.getElementById('btn-download-receipt');
      var self = this;

      if (!modal) return;

      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          self.closeModal(modal);
        });
      });

      modal.addEventListener('click', function(e) {
        if (e.target === modal) self.closeModal(modal);
      });

      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          var contentEl = document.getElementById('receipt-content');
          var idEl = document.getElementById('receipt-id');
          if (!contentEl) return;
          var fullText = '【河北工程大学科信学院凌云油车队 · 表单受理回执】\n受理编号: ' + (idEl ? idEl.textContent : '') + '\n\n' + contentEl.textContent;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullText).then(function() {
              var toastFn = (typeof showToast !== 'undefined') ? showToast : (global.showToast || (global.LingYun && global.LingYun.showToast));
              if (typeof toastFn === 'function') toastFn('📋 回执信函已成功复制到剪贴板！', 'success');
            });
          }
        });
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
          var contentEl = document.getElementById('receipt-content');
          var idEl = document.getElementById('receipt-id');
          var targetEl = document.getElementById('receipt-target');
          var nameEl = document.getElementById('receipt-name');
          var timeEl = document.getElementById('receipt-time');
          if (!contentEl) return;
          var fullText = '=================================================================\n' +
            ' 🏎️ 河北工程大学科信学院凌云油车队 · 官方表单受理与初审确认凭证\n' +
            '=================================================================\n\n' +
            '受理编号: ' + (idEl ? idEl.textContent : '') + '\n' +
            '申请人/单位: ' + (nameEl ? nameEl.textContent : '') + '\n' +
            '申报类别: ' + (targetEl ? targetEl.textContent : '') + '\n' +
            '受理时间: ' + (timeEl ? timeEl.textContent : '') + '\n\n' +
            '-------------------- 官方初审指引与回执信函 --------------------\n\n' +
            contentEl.textContent + '\n\n' +
            '=================================================================\n' +
            '官方接收邮箱: diskomiakhan@gmail.com\n' +
            '车间基地: 河北省邯郸市科信学院成学楼东侧机械装备与制造学院\n' +
            '=================================================================\n';
          var blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = '凌云油车队_受理回执_' + (idEl ? idEl.textContent : 'receipt') + '.txt';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        });
      }
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.ModalEngine = ModalEngine;

  // 向后兼容全局作用域
  global.ModalEngine = ModalEngine;
})(typeof window !== 'undefined' ? window : this);
