/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: debug - LYDebug (轻量级调试日志与诊断基础设施)
 * =========================================================================
 *
 * 功能特性：
 *  - URL 参数激活 (?debug=1)，或通过控制台 LingYun.debug.enable() 打开
 *  - 错误始终记录，无论开关状态
 *  - 模块级日志按时间线排序
 *  - 控制台友好型交互 API
 */

'use strict';

(function(global) {
  var LYDebug = {
    _logs: [],
    enabled: false,

    _init: function() {
      // 检测 URL 参数 ?debug=1 自动激活
      if (typeof location !== 'undefined') {
        try {
          var params = new URLSearchParams(location.search);
          if (params.get('debug') === '1') {
            this.enabled = true;
          }
        } catch (e) {
          // URL 解析失败（如 file:/// 协议下某些浏览器），静默跳过
        }
      }
    },

    enable: function() {
      this.enabled = true;
      console.log('%c[LYDebug] 调试模式已开启', 'color: #10b981; font-weight: bold');
    },

    disable: function() {
      this.enabled = false;
      console.log('%c[LYDebug] 调试模式已关闭', 'color: #6b7280');
    },

    log: function(module, msg, data) {
      var entry = {
        level: 'log',
        module: module,
        msg: msg,
        data: data || null,
        time: Date.now()
      };
      this._logs.push(entry);
      if (this.enabled) {
        if (data) {
          console.log('%c[' + module + ']%c ' + msg, 'color: #3b82f6; font-weight: bold', 'color: inherit', data);
        } else {
          console.log('%c[' + module + ']%c ' + msg, 'color: #3b82f6; font-weight: bold', 'color: inherit');
        }
      }
    },

    warn: function(module, msg, data) {
      var entry = {
        level: 'warn',
        module: module,
        msg: msg,
        data: data || null,
        time: Date.now()
      };
      this._logs.push(entry);
      if (this.enabled) {
        console.warn('[' + module + '] ' + msg, data || '');
      }
    },

    error: function(module, msg, err) {
      var entry = {
        level: 'error',
        module: module,
        msg: msg,
        error: err ? (err.stack || err.message || String(err)) : null,
        time: Date.now()
      };
      this._logs.push(entry);
      // 错误始终输出，无论 enabled 开关
      console.error('[' + module + '] ' + msg, err || '');
    },

    dump: function() {
      console.group('%c🏎️ LingYun Debug Log (' + this._logs.length + ' entries)', 'font-size: 14px; color: #dc2626');
      this._logs.forEach(function(entry) {
        var time = new Date(entry.time).toLocaleTimeString();
        var prefix = '[' + time + '] [' + entry.module + '] ';
        if (entry.level === 'error') {
          console.error(prefix + entry.msg, entry.error || '');
        } else if (entry.level === 'warn') {
          console.warn(prefix + entry.msg, entry.data || '');
        } else {
          console.log(prefix + entry.msg, entry.data || '');
        }
      });
      console.groupEnd();
      return this._logs.length + ' entries dumped';
    },

    getModuleLog: function(moduleName) {
      return this._logs.filter(function(e) {
        return e.module === moduleName;
      });
    },

    getErrors: function() {
      return this._logs.filter(function(e) {
        return e.level === 'error';
      });
    },

    getTimeline: function() {
      return this._logs.map(function(e) {
        return {
          time: new Date(e.time).toLocaleTimeString(),
          level: e.level,
          module: e.module,
          msg: e.msg
        };
      });
    },

    clear: function() {
      this._logs = [];
      console.log('%c[LYDebug] 日志已清空', 'color: #6b7280');
    }
  };

  // 立即初始化检测 URL 参数
  LYDebug._init();

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.debug = LYDebug;

  // 向后兼容全局作用域
  global.LYDebug = LYDebug;
})(typeof window !== 'undefined' ? window : this);
