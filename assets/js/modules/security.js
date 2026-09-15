/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: security - SecurityShield (安全防护、防复刻拦截与防篡改引擎)
 * =========================================================================
 *
 * 核心安全机制：
 *  1. 署名完整性校验 (Anti-Tampering Signature)：保护车队品牌与版权权益
 *  2. 开发者快捷穿透 (?debug=1)：允许开发者不受拦截地调试
 *  3. 防盗取快捷键拦截：拦截 F12、Ctrl+Shift+I、Ctrl+U、Ctrl+S
 *  4. 防右键抓取菜单：拦截页面右键，同时智能放行表单输入框的正常粘贴与编辑
 *  5. 控制台专属安全与版权告示水印
 */

'use strict';

(function(global) {
  const SecurityShield = {
    signatureValid: true,

    init() {
      // 若带有 ?debug=1 开发参数，静默跳过客户端拦截，方便开发者本地调试
      if (typeof location !== 'undefined' && location.search && location.search.includes('debug=1')) {
        console.log('%c[SecurityShield] 开发调试模式激活，安全拦截已旁路', 'color: #10b981; font-weight: bold');
        return;
      }

      this.verifySignature();
      this.enforceFrameBusting();
      this.bindProtectionEvents();
      this.printConsoleWatermark();
    },

    /**
     * 防点击劫持 (Anti-Clickjacking / Framebusting 保护)
     */
    enforceFrameBusting() {
      try {
        if (typeof window !== 'undefined' && window.top && window.top !== window.self) {
          // 检测到当前页面被嵌入到外部 iframe 中，实施跳出顶层重定向
          window.top.location = window.self.location;
        }
      } catch (e) {
        // 跨域沙箱阻止访问 window.top 时隐藏 body 避免界面被劫持透明蒙层利用
        try {
          if (typeof document !== 'undefined' && document.body) {
            document.body.style.display = 'none';
          }
        } catch (_) {}
      }
    },

    /**
     * 1. 署名与版权完整性自校验
     */
    verifySignature() {
      if (typeof document === 'undefined') return;

      const footer = document.querySelector('footer');
      const footerText = footer ? footer.textContent : '';
      const hasTeam = document.body ? document.body.textContent.includes('凌云油车队') : true;

      if (!hasTeam) {
        this.signatureValid = false;
        console.warn('⚠️ 警告：检测到页面车队标识已被篡改或移除。请尊重作者劳动成果。');
      }
    },

    /**
     * 2. 防快捷键与右键抓取拦截
     */
    bindProtectionEvents() {
      if (typeof document === 'undefined') return;

      // 禁用页面级右键菜单（但放行表单输入框与文本域，保障招新与赞助表单正常使用）
      document.addEventListener('contextmenu', (e) => {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
          return true; // 表单正常输入与粘贴放行
        }
        e.preventDefault();
        return false;
      }, { capture: true });

      // 拦截开发者工具与查看源码快捷键 (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+S)
      document.addEventListener('keydown', (e) => {
        const isCtrl = e.ctrlKey || e.metaKey;
        const key = e.key ? e.key.toUpperCase() : '';
        const keyCode = e.keyCode || e.which;

        // F12 拦截 (keyCode 123)
        if (key === 'F12' || keyCode === 123) {
          e.preventDefault();
          return false;
        }

        // Ctrl + U (查看源代码)
        if (isCtrl && key === 'U') {
          e.preventDefault();
          return false;
        }

        // Ctrl + S (整页保存)
        if (isCtrl && key === 'S') {
          e.preventDefault();
          return false;
        }

        // Ctrl + Shift + I / J / C (开发者工具快捷键)
        if (isCtrl && e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) {
          e.preventDefault();
          return false;
        }
      }, { capture: true });
    },

    /**
     * 3. 控制台 Apple 极简安全告示
     */
    printConsoleWatermark() {
      if (typeof console === 'undefined') return;

      try {
        console.log(
          '%c🏎️ 河北工程大学科信学院 凌云油车队 (Lingyun Oil Racing Team)%c\n\n' +
          '2026 赛季 FSC 官方互动系统 · 工业级高帧率赛车交互引擎\n' +
          'All rights reserved. Unauthorized reproduction or reverse-engineering is strictly prohibited.\n',
          'background: #103A82; color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;',
          'color: #6b7280; font-size: 11px; line-height: 1.6;'
        );
      } catch (e) {
        // 静默
      }
    },

    /**
     * 4. 管理员身份认证与会话管理 (Admin Authentication & Session Engine)
     */
    AdminAuth: {
      sessionKey: 'ly_admin_session',
      lockKey: 'ly_admin_auth_lock',

      // 授权的管理员凭据列表
      credentials: [
        { user: 'admin', pass: 'lingyun2026' },
        { user: 'ZhenpoLi', pass: 'lingyun2026' }
      ],

      /**
       * 检查当前是否处于防爆破锁定状态
       */
      checkLockStatus() {
        try {
          if (typeof sessionStorage === 'undefined') return { locked: false };
          const raw = sessionStorage.getItem(this.lockKey);
          if (!raw) return { locked: false };
          const data = JSON.parse(raw);
          const now = Date.now();
          if (data.lockUntil && now < data.lockUntil) {
            const remainSec = Math.ceil((data.lockUntil - now) / 1000);
            return { locked: true, remainSec };
          }
          sessionStorage.removeItem(this.lockKey);
          return { locked: false };
        } catch (e) {
          return { locked: false };
        }
      },

      /**
       * 记录失败尝试并触发频控
       */
      recordFailure() {
        try {
          if (typeof sessionStorage === 'undefined') return { attempts: 1 };
          const raw = sessionStorage.getItem(this.lockKey);
          let data = raw ? JSON.parse(raw) : { attempts: 0 };
          data.attempts = (data.attempts || 0) + 1;
          if (data.attempts >= 5) {
            data.lockUntil = Date.now() + 60 * 1000; // 锁定 60 秒
          }
          sessionStorage.setItem(this.lockKey, JSON.stringify(data));
          return data;
        } catch (e) {
          return { attempts: 1 };
        }
      },

      /**
       * 清除失败记录
       */
      clearFailure() {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(this.lockKey);
          }
        } catch (_) {}
      },

      /**
       * 执行身份认证
       */
      login(username, password) {
        const lock = this.checkLockStatus();
        if (lock.locked) {
          return {
            success: false,
            message: `多次尝试错误，安全防护锁定中，请在 ${lock.remainSec} 秒后重试。`
          };
        }

        const cleanUser = String(username || '').trim().toLowerCase();
        const cleanPass = String(password || '').trim();

        const matched = this.credentials.some(
          c => c.user.toLowerCase() === cleanUser && c.pass === cleanPass
        );

        if (matched) {
          this.clearFailure();
          const session = {
            user: cleanUser,
            token: 'ly_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
            loginAt: Date.now(),
            expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2小时有效期
          };
          try {
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
            }
          } catch (_) {}

          return { success: true, session };
        } else {
          const failData = this.recordFailure();
          const remain = Math.max(0, 5 - failData.attempts);
          return {
            success: false,
            message: failData.lockUntil 
              ? '密码错误次数过多，账号已临时锁定 60 秒！'
              : `账号或密码错误！还可尝试 ${remain} 次。`
          };
        }
      },

      /**
       * 检查当前会话是否有效
       */
      isAuthenticated() {
        try {
          if (typeof sessionStorage === 'undefined') return false;
          const raw = sessionStorage.getItem(this.sessionKey);
          if (!raw) return false;
          const session = JSON.parse(raw);
          if (!session || !session.expiresAt) return false;
          if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem(this.sessionKey);
            return false;
          }
          return true;
        } catch (e) {
          return false;
        }
      },

      /**
       * 获取当前登录用户信息
       */
      getCurrentUser() {
        try {
          if (typeof sessionStorage === 'undefined') return null;
          const raw = sessionStorage.getItem(this.sessionKey);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      },

      /**
       * 退出登录
       */
      logout() {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(this.sessionKey);
          }
        } catch (_) {}
      }
    }
  };

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.SecurityShield = SecurityShield;

  // 向后兼容全局作用域
  global.SecurityShield = SecurityShield;
})(typeof window !== 'undefined' ? window : this);
