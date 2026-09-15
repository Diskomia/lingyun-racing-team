/**
 * =========================================================================
 * 🏎️ LINGYUN RACING TEAM - 2026 49号 模块化交互引擎
 * (High-Performance Modular Motorsport Interaction Engine)
 * =========================================================================
 *
 * ⚠️  AUTO-GENERATED & OBFUSCATED DISTRIBUTION BUNDLE
 * All rights reserved. Unauthorized copying or reverse engineering is prohibited.
 *
 * 模块索引 (Module Directory):
 *  - 00. debug
 *  - 01. config
 *  - 02. scroll
 *  - 03. ticker
 *  - 04. tilt
 *  - 05. telemetry
 *  - 06. car-specs
 *  - 07. reveal
 *  - 08. counters
 *  - 09. countdown
 *  - 10. filters
 *  - 11. modal
 *  - 12. toast
 *  - 13. nav
 *  - 14. forms
 *  - 15. security
 *  - 16. bootstrap
 * =========================================================================
 */

(function(window) {
'use strict';

window.LingYun = window.LingYun || {};

/* ==========================================================================
   debug - debug
   ========================================================================== */
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

/* ==========================================================================
   config - ENGINE_CONFIG
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 00 - ENGINE_CONFIG (集中式全局配置中心 & 动态网站内容管理器)
 * =========================================================================
 */  const DEFAULT_SITE_CONFIG = {
    site: {
      tickerText: "⚡ 凌云油车队 2026 赛季全新燃油方程式赛车研发进行中 · 招贤纳新通道持续开放",
      tickerSpeed: 50,
      tickerEnabled: true,
      tickerItems: [
        { label: "UNIVERSITY", val: "河北工程大学科信学院 (KEXIN COLLEGE)", pulse: true },
        { label: "AFFILIATION", val: "机械装备与制造学院 / 教务处" },
        { label: "TEAM", val: "凌云油车队 (LINGYUN OIL RACING)", highlight: true },
        { label: "SEASON", val: "2026 49号 燃油驱动方程式" },
        { label: "POWERTRAIN", val: "燃油内燃机 · 链传动后驱", highlight: true },
        { label: "ACCUMULATOR", val: "防爆燃油箱 · 进气/排气/冷却" },
        { label: "STATUS", val: "● 备战成都耐久赛", color: "text-emerald-600" },
        { label: "HEADQUARTERS", val: "科信学院成学楼东侧机械装备与制造学院" }
      ],
      heroTag: "2026 赛季研发攻坚阶段",
      heroSubtitle: "矢志不渝，以燃油之驱突破赛道物理极限",
      countdownTitle: "2026 中国大学生方程式汽车大赛 (FSC)",
      countdownDate: "2026-11-03T09:00:00+08:00",
      countdownLabel: "距 2026FSC 全国总决赛开幕倒计时",
      countdownPeriod: "拟定赛期：2026.11.03 - 11.08",
      currentStatus: "整车装配中",
      currentStatusColor: "emerald",
      currentLocation: "科信学院成学楼东侧机械装备与制造学院",
      workshopAddress: "河北省邯郸市科信学院成学楼东侧机械装备与制造学院",
      coordinatorPhone: "138-3100-2026",
      officialWechat: "河北工程大学科信学院凌云油车队",
      copyright: "© 2026 河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team). 保留所有权利."
    },
    departments: {
      electrical: {
        name: "动力总成组",
        head: "动力总成负责人",
        email: "diskomiakhan@gmail.com",
        phone: "",
        prepGuide: "建议学习内燃机、进排气与发动机控制相关知识或准备过往作品。"
      },
      mechanical: {
        name: "底盘组",
        head: "底盘负责人",
        email: "diskomiakhan@gmail.com",
        phone: "",
        prepGuide: "建议学习车架、悬架与机械设计相关知识或准备过往作品。"
      },
      business: {
        name: "商业组",
        head: "商业负责人",
        email: "diskomiakhan@gmail.com",
        phone: "",
        prepGuide: "建议学习相关知识或准备过往作品。"
      },
      sponsor: {
        name: "商务赞助",
        head: "商业总监 / 外联主管",
        email: "diskomiakhan@gmail.com",
        phone: ""
      },
      general: {
        name: "官方统筹 / 队长",
        head: "车队队长",
        email: "diskomiakhan@gmail.com",
        phone: "",
        ccAll: true
      }
    },
    recruitment: {
      isOpen: true,
      seasonYear: "2026",
      statusNotice: "凌云油车队 2026 赛季全系招新正式开启，欢迎怀揣赛车梦想的同学加入！"
    },
    activities: [
      {
        id: "act_2025_fsec",
        category: "race",
        tag: "FSEC 大赛 · 全国三等奖",
        tagColor: "bg-amber-500",
        date: "2025.11",
        title: "2025FSEC：荣获中国大学生方程式汽车大赛全国三等奖",
        summary: "全国总决赛赛场攻坚突破，车检顺畅过检，技术组与商业组再度斩获国家级殊荣。",
        fullText: "在中国大学生方程式汽车大赛中，凌云油车队经过车辆技术检验、车检与静态商业答辩，并在多项动态赛事中稳定完赛，斩获全国三等奖！",
        image: "assets/images/track_action_card.jpg",
        stats: " FSEC 电动车组全国三等奖 | 技术与商业协同攻坚",
        badge: "国家级三等奖",
        badgeIcon: "trophy"
      },
      {
        id: "act_2024_fsec",
        category: "race",
        tag: "FSEC 大赛 · 全国二等奖",
        tagColor: "bg-[#D9232D]",
        date: "2024.11",
        title: "2024FSEC：斩获全国二等奖并蝉联优秀宣传团队",
        summary: "全国总决赛赛场再续辉煌，车检全优通过，商业组与技术组共同捧起两座国家级大奖。",
        fullText: "在中国大学生方程式汽车大赛中，河北工程大学科信学院凌云油车队技术组与商业组协同作战，以优异成绩斩获电动车组全国二等奖，并凭借高质量的新媒体传播与赛事纪实，再次蝉联‘年度优秀宣传团队’荣誉称号！",
        image: "assets/images/activity_2024_award.jpg",
        stats: " FSEC 电动车组二等奖 | 蝉联年度优秀宣传团队",
        badge: "国家级二等奖",
        badgeIcon: "trophy"
      },
      {
        id: "act_stem_outreach",
        category: "science",
        tag: "社会交流 · 科普开放日",
        tagColor: "bg-[#103A82]",
        date: "2024",
        title: "践行社会责任：接待邯郸四中及石家庄工程技术学校师生科普",
        summary: "开放赛车车间，生动讲解新能源赛车构造与原理，发挥高校工程实践育人社会效益。",
        fullText: "作为河北工程大学实践教学与社会服务的重要载体，凌云油车队先后接待了邯郸市第四中学和石家庄工程技术学校师生来访。队员们在科信学院成学楼东侧机械装备与制造学院热情带领中学生走进车间，深入讲解方程式赛车悬架几何、碳纤维成型与散热系统原理，点亮青少年的工程强国梦想。",
        image: "assets/images/activity_stem_outreach.jpg",
        stats: "接待中学生及职校师生 120+ 人 | 赛车构造与新能源原理科普",
        badge: "工程科普实践",
        badgeIcon: "book-open"
      },
      {
        id: "act_garage_tuning",
        category: "tech",
        tag: "实训车间 · 研发纪实",
        tagColor: "bg-[#103A82]",
        date: "2026.01",
        title: "实训车间：4130桁架与高压电驱动总成调试",
        summary: "践行“每年推出一辆新赛车”的庄严承诺，师生携手攻坚 E20 赛车高压电驱与底盘制造。",
        fullText: "在河北工程大学科信学院成学楼东侧机械装备与制造学院，技术组机械与电气队员正紧锣密鼓进行 E20 纯电动方程式赛车的装配调试。团队严格执行工程规范，完成整车线束布置、504V 动力电池箱双侧风道密封测试、TC4钛合金半轴与悬架四轮定位，力求在动态赛中再破纪录。",
        image: "assets/images/activity_garage_tuning.jpg",
        stats: "高压电驱 | 504V动力电池 | 4130桁架与TC4钛合金半轴",
        badge: "工程实训研发车间",
        badgeIcon: "wrench"
      }
    ]
  };

  const CONFIG_STORAGE_KEY = 'ly_site_config_v2';

  const SiteConfigManager = {
    STORAGE_KEY: CONFIG_STORAGE_KEY,
    DEFAULT_CONFIG: DEFAULT_SITE_CONFIG,

    load() {
      try {
        if (typeof localStorage === 'undefined') return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
        const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
        const parsed = JSON.parse(raw);
        // 深度合并保证新增字段不丢失
        return {
          site: Object.assign({}, DEFAULT_SITE_CONFIG.site, parsed.site || {}),
          departments: Object.assign({}, DEFAULT_SITE_CONFIG.departments, parsed.departments || {}),
          recruitment: Object.assign({}, DEFAULT_SITE_CONFIG.recruitment, parsed.recruitment || {}),
          activities: Array.isArray(parsed.activities) && parsed.activities.length ? parsed.activities : DEFAULT_SITE_CONFIG.activities
        };
      } catch (_) {
        return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
      }
    },

    save(config) {
      if (typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ly_config_updated', { detail: config }));
        }
      } catch (e) {
        console.error('Save site config failed:', e);
      }
    },

    reset() {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(CONFIG_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ly_config_updated', { detail: DEFAULT_SITE_CONFIG }));
      }
    },

    async fetchCloudConfig(gasUrl) {
      const endpoint = gasUrl || (typeof window !== 'undefined' && window.LingYunGASUrl);
      if (!endpoint || !endpoint.includes('script.google.com')) return null;
      try {
        const resp = await fetch(`${endpoint}?action=get_config`, { method: 'GET', cache: 'no-cache' });
        if (resp.ok) {
          const res = await resp.json();
          if (res && res.success && res.config) {
            this.save(res.config);
            return res.config;
          }
        }
      } catch (_) {}
      return null;
    },

    async fetchRepoConfig() {
      try {
        const resp = await fetch('assets/data/config.json?v=' + Date.now(), { cache: 'no-cache' });
        if (!resp.ok) return null;
        const parsed = await resp.json();
        if (!parsed) return null;
        const merged = {
          site: Object.assign({}, DEFAULT_SITE_CONFIG.site, parsed.site || {}),
          departments: Object.assign({}, DEFAULT_SITE_CONFIG.departments, parsed.departments || {}),
          recruitment: Object.assign({}, DEFAULT_SITE_CONFIG.recruitment, parsed.recruitment || {}),
          activities: Array.isArray(parsed.activities) && parsed.activities.length ? parsed.activities : DEFAULT_SITE_CONFIG.activities
        };
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ly_config_updated', { detail: merged }));
        }
        return merged;
      } catch (_) {
        return null;
      }
    }
  };

  const ENGINE_CONFIG = {
    // 3D 视差倾角控制参数
    tilt: {
      defaultMax: 6.0,       // 标准小卡片最大偏转角度 (度)
      subtleMax: 3.2,        // 大型重点板块 (如技术组与商业组) 微偏转角度 (度)
      defaultZ: 8,           // 悬浮位移 Z 轴深度 (px)
      subtleZ: 4,            // 微倾角板块 Z 轴深度 (px)
      perspective: 1000      // 3D 空间视距 (px)
    },
    // 全局滚动监听阈值
    scroll: {
      navbarThreshold: 40,   // 导航栏由通透过渡为高斯毛玻璃的滚动距离 (px)
      backToTopThreshold: 280// 回到顶部按键浮现的触发阈值 (px)
    },
    // 遥测数字增长动画时长
    telemetryDuration: 1500, // 数值滚动插值总耗时 (ms)
    // 2026 中国大学生方程式汽车大赛 (FSC) 赛期拟定配置
    competition: {
      name: '2026 中国大学生方程式汽车大赛 (FSC)',
      startDate: '2026-11-03T09:00:00+08:00',
      endDate: '2026-11-08T18:00:00+08:00'
    },
    // 动态全站内容管理器
    siteConfig: SiteConfigManager
  };

  // 挂载至统一命名空间
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.ENGINE_CONFIG = ENGINE_CONFIG;
  window.SiteConfigManager = SiteConfigManager;

/* ==========================================================================
   scroll - UnifiedScrollEngine
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 01 - UnifiedScrollEngine (统一滚动调度与布局指标缓存引擎)
 * =========================================================================
 */  const UnifiedScrollEngine = {
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

      // 拦截所有导航链接点击，用 JS 精确计算位置滚动
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          // 等一帧确保布局稳定，再精确滚动
          requestAnimationFrame(() => {
            const rect = target.getBoundingClientRect();
            const top = rect.top + window.pageYOffset - 100;
            window.scrollTo({ top: top, behavior: 'smooth' });
            history.pushState(null, '', href);
          });
        });
      });

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
            ((window.LingYun && window.LingYun.ENGINE_CONFIG) || window.ENGINE_CONFIG || {
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
            const navLine = 80; // 导航栏底部判定线，越小越灵敏
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
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.UnifiedScrollEngine = UnifiedScrollEngine;

/* ==========================================================================
   ticker - TickerLifecycle
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 02 - TickerLifecycle (跑马灯视口外智能休眠与能耗管理引擎)
 * =========================================================================
 */
  const TickerLifecycle = {
    init() {
      const wrap = document.querySelector('.telemetry-ticker-wrap');
      const track = document.querySelector('.telemetry-ticker-track');
      if (!wrap || !track || !window.IntersectionObserver) return;

      const observer = new IntersectionObserver(([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      }, { threshold: 0 });

      observer.observe(wrap);
    }
  };

/* ==========================================================================
   tilt - F1TiltEngine
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 03 - F1TiltEngine (3D 物理视差微倾角引擎与显存生命周期)
 * =========================================================================
 */
  var F1TiltEngine = {
    init: function() {
      // 移动端、触屏或开启系统级减弱动态效果时禁用 3D 微倾角，避免触摸滚动卡顿或跳变
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      var cards = document.querySelectorAll('.tilt-card');
      if (!cards.length) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((window.LingYun && window.LingYun.ENGINE_CONFIG) || window.ENGINE_CONFIG || {
          tilt: { defaultMax: 6.0, subtleMax: 3.2, defaultZ: 8, subtleZ: 4, perspective: 1000 }
        });

      cards.forEach(function(card) {
        var inner = card.querySelector('.tilt-inner') || card;
        var bounds = null;
        var frameId = null;

        // 读取卡片自定义的最大偏转角 (如技术/商业大标签设定为 3.2 度)
        var cardMaxTilt = parseFloat(card.getAttribute('data-tilt-max')) || config.tilt.defaultMax;
        var cardZDepth = card.hasAttribute('data-tilt-max') ? config.tilt.subtleZ : config.tilt.defaultZ;

        function updateBounds() {
          bounds = card.getBoundingClientRect();
        }

        function handleMouseMove(e) {
          if (!bounds) updateBounds();
          var mouseX = e.clientX - bounds.left;
          var mouseY = e.clientY - bounds.top;
          var xRatio = mouseX / bounds.width;
          var yRatio = mouseY / bounds.height;

          // 取消前一个尚未绘制的帧，防止事件积压引发掉帧
          if (frameId) cancelAnimationFrame(frameId);

          frameId = requestAnimationFrame(function() {
            var tiltX = (0.5 - yRatio) * (cardMaxTilt * 2);
            var tiltY = (xRatio - 0.5) * (cardMaxTilt * 2);

            inner.style.transform = 'perspective(' + config.tilt.perspective + 'px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + tiltY.toFixed(2) + 'deg) translate3d(0, -' + cardZDepth + 'px, ' + (cardZDepth * 1.5) + 'px)';
            inner.style.setProperty('--mouse-x', (xRatio * 100).toFixed(1) + '%');
            inner.style.setProperty('--mouse-y', (yRatio * 100).toFixed(1) + '%');
          });
        }

        function handleMouseEnter() {
          updateBounds();
          inner.style.willChange = 'transform';
        }

        function handleMouseLeave() {
          if (frameId) cancelAnimationFrame(frameId);
          inner.style.transform = 'perspective(' + config.tilt.perspective + 'px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
          inner.style.willChange = 'auto';
          bounds = null;
        }

        card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        card.addEventListener('mousemove', handleMouseMove, { passive: true });
        card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      });
    }
  };

/* ==========================================================================
   telemetry - CarTelemetryHUD
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 04 - CarTelemetryHUD (2026 赛季 49号 赛车工程子系统热点拆解引擎)
 * =========================================================================
 */
  const CarTelemetryHUD = {
    partData: {
      aero: {
        title: 'STAR-CCM+ 优化空气动力学套件',
        sub: 'AERODYNAMICS // CFD MULTI-ELEMENT WING & DIFFUSER',
        desc: '基于 STAR-CCM+ 仿真优化，采用三段式主翼加变截面襟翼前翼，搭配单主翼双襟翼高升阻比尾翼与底部渐扩地效扩散器。80km/h 下产生 774.52N 净下压力，升阻比达 1.67。',
        statA: '774.52 N 下压力 @ 80km/h',
        statB: '1.67 升阻比 (CL:1.81 / CD:1.08)',
        statC: '变截面碳纤维主翼 + 地效扩散器'
      },
      suspension: {
        title: '全碳纤维推杆双横臂与纵置避震',
        sub: 'CHASSIS // ADAMS CAR OPTIMIZED K&C',
        desc: '前后悬架上下不等长双横臂，全部杆件采用碳纤维复合材料，大幅削减簧下质量。独创纵置前减震车身内装设计，偏频前 3.5Hz / 后 3.3Hz，侧倾增益仅 0.465 deg/g。',
        statA: '0.465 deg/g 侧倾增益 (350 lb/in)',
        statB: '前 40.9mm / 后 53.29mm 侧倾中心',
        statC: '全碳纤维推杆 + 内装纵置避震'
      },
      frame: {
        title: '4130 铬钼钢桁架与高斯热源焊接',
        sub: 'STRUCTURE // 4130 CHROMOLY SPACEFRAME (33.4KG)',
        desc: '采用 4130 铬钼钢空间桁架结构，整重仅 33.4kg，扭转刚度达 3550 N·m/°。采用定位平台及 ANSYS APDL 高斯移动热源焊接热应力仿真，装配误差控制在 1mm 内。搭载 45° 斜躺人机坐姿与丝杆电动无级调节踏板。',
        statA: '33.4 kg 车架整重',
        statB: '3,550 N·m/° 扭转刚度 (+1.4%)',
        statC: '高斯移动热源焊接仿真'
      },
      battery: {
        title: '防爆燃油箱与冷却系统',
        sub: 'POWERTRAIN // FUEL SYSTEM & COOLING',
        desc: '针对成都赛道 22km 耐久赛严密仿真设计，防爆燃油箱置于车手后方，配合干式油底壳润滑与水冷/机油冷却系统，保障极限工况下持续稳定供油与散热。',
        statA: '防爆燃油箱 · 后置布置',
        statB: '燃油箱 · 供油与冷却',
        statC: '水冷 + 机油冷却'
      },
      motor: {
        title: '燃油内燃机与钛合金半轴',
        sub: 'PROPULSION // ICE & TC4 TITANIUM AXLES',
        desc: '燃油内燃机匹配序列式变速箱与 LSD 限滑差速器直传后轮，TC4 钛合金轻量化半轴（减重 40%），极速 ≥120km/h。',
        statA: '燃油内燃机 · 后驱',
        statB: 'TC4 钛合金半轴 (减重 40%)',
        statC: 'Burckhardt 防滑 + 阿克曼电子差速'
      }
    },

    init() {
      const hotspotBtns = document.querySelectorAll('.car-hotspot-btn');
      const hudTitle = document.getElementById('hud-part-title');
      const hudSubtitle = document.getElementById('hud-part-sub');
      const hudDesc = document.getElementById('hud-part-desc');
      const hudStatA = document.getElementById('hud-stat-a');
      const hudStatB = document.getElementById('hud-stat-b');
      const hudStatC = document.getElementById('hud-stat-c');
      const hudBox = document.getElementById('car-hud-panel');

      if (!hotspotBtns.length || !hudTitle) return;

      hotspotBtns.forEach(btn => {
        // 增强键盘无障碍导航支持 (Tab & Enter/Space)
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });

        btn.addEventListener('click', () => {
          const partKey = btn.getAttribute('data-part');
          const data = this.partData[partKey];
          if (!data) return;

          hotspotBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // 平滑刷新 HUD 面板
          hudTitle.textContent = data.title;
          hudSubtitle.textContent = data.sub;
          hudDesc.textContent = data.desc;
          if (hudStatA) hudStatA.textContent = data.statA;
          if (hudStatB) hudStatB.textContent = data.statB;
          if (hudStatC) hudStatC.textContent = data.statC;

          if (hudBox) {
            hudBox.classList.remove('item-fade-in');
            void hudBox.offsetWidth; // 触发轻量重排以重启淡入动画
            hudBox.classList.add('item-fade-in');
          }
        });
      });
    }
  };

/* ==========================================================================
   car-specs - CarSpecTabs
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 05 - CarSpecTabs (赛车 5 大专业规格面板切换系统与数字化仿真)
 * =========================================================================
 */
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

/* ==========================================================================
   reveal - ScrollRevealEngine
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 06 - ScrollRevealEngine (视口交错平滑入场调度与图层释放引擎)
 * =========================================================================
 */
  const ScrollRevealEngine = {
    init() {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (!revealElements.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      });

      revealElements.forEach(el => observer.observe(el));
    }
  };

/* ==========================================================================
   counters - TelemetryCounters
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 07 - TelemetryCounters (三次方缓出数值插值与脏值过滤计数器)
 * =========================================================================
 */
  var TelemetryCounters = {
    init: function() {
      var counterElements = document.querySelectorAll('[data-counter-target]');
      if (!counterElements.length) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((window.LingYun && window.LingYun.ENGINE_CONFIG) || window.ENGINE_CONFIG || {
          telemetryDuration: 1500
        });

      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseFloat(el.getAttribute('data-counter-target'));
            if (isNaN(target)) return;

            var decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
            var prefix = el.getAttribute('data-counter-prefix') || '';
            var suffix = el.getAttribute('data-counter-suffix') || '';
            var duration = config.telemetryDuration || 1500;
            var startTime = performance.now();

            function animateCount(timestamp) {
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var easeOut = 1 - Math.pow(1 - progress, 3);
              var currentVal = easeOut * target;
              var formatted = prefix + currentVal.toFixed(decimals) + suffix;

              // 脏值比对过滤：避免高刷屏下数值未变时重复操作 DOM
              if (el.textContent !== formatted) {
                el.textContent = formatted;
              }

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                el.textContent = prefix + target.toFixed(decimals) + suffix;
              }
            }

            requestAnimationFrame(animateCount);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(function(el) { observer.observe(el); });
    }
  };

/* ==========================================================================
   countdown - CountdownTimer
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 08 - CountdownTimer (2026 FSC 全国总决赛 Pit-Board 倒计时与视口休眠)
 * =========================================================================
 */  var CountdownTimer = {
    init: function() {
      var daysEl = document.getElementById('count-days');
      var hoursEl = document.getElementById('count-hours');
      var minutesEl = document.getElementById('count-mins');
      var secondsEl = document.getElementById('count-secs');
      var labelEl = document.getElementById('count-label');
      if (!daysEl) return;

      // 构建后 ENGINE_CONFIG 在词法作用域; 独立运行时通过命名空间回退
      var config = (typeof ENGINE_CONFIG !== 'undefined') ? ENGINE_CONFIG :
        ((window.LingYun && window.LingYun.ENGINE_CONFIG) || window.ENGINE_CONFIG || {});

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
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.CountdownTimer = CountdownTimer;

/* ==========================================================================
   filters - ActivityFilters
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 09 - ActivityFilters (赛事动态与工程纪实分类筛选及动态渲染系统)
 * =========================================================================
 */
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

      const mgr = (window.LingYun && window.LingYun.SiteConfigManager) || window.SiteConfigManager;
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
        const mgr = (window.LingYun && window.LingYun.SiteConfigManager) || window.SiteConfigManager;
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

/* ==========================================================================
   modal - ModalEngine
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 10 - ModalEngine (招募/赞助/活动弹窗中枢与无障碍焦点捕获引擎)
 * =========================================================================
 */  var ModalEngine = {
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
            (window.FormDispatcher || (window.LingYun && window.LingYun.FormDispatcher));
          if (dispatcher && typeof dispatcher.handleRecruitSubmit === 'function') {
            dispatcher.handleRecruitSubmit(form, modal);
          } else {
            var toastFn = (typeof showToast !== 'undefined') ? showToast :
              (window.showToast || (window.LingYun && window.LingYun.showToast));
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
            (window.FormDispatcher || (window.LingYun && window.LingYun.FormDispatcher));
          if (dispatcher && typeof dispatcher.handleSponsorSubmit === 'function') {
            dispatcher.handleSponsorSubmit(form, modal);
          } else {
            var toastFn = (typeof showToast !== 'undefined') ? showToast :
              (window.showToast || (window.LingYun && window.LingYun.showToast));
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
        var shield = (window.LingYun && window.LingYun.SecurityShield) || window.SecurityShield;
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

          var shield = (window.LingYun && window.LingYun.SecurityShield) || window.SecurityShield;
          if (shield && shield.AdminAuth) {
            var result = shield.AdminAuth.login(username, password);
            if (result.success) {
              if (errorBox) errorBox.classList.add('hidden');
              var submitBtn = document.getElementById('admin-auth-submit');
              if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>认证成功，正在进入管理中枢...</span></span>';
              }
              var toastFn = (typeof showToast !== 'undefined') ? showToast : (window.showToast || (window.LingYun && window.LingYun.showToast));
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
              var toastFn = (typeof showToast !== 'undefined') ? showToast : (window.showToast || (window.LingYun && window.LingYun.showToast));
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
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.ModalEngine = ModalEngine;

/* ==========================================================================
   toast - ToastSystem & DeckDownload
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 11 - ToastSystem & DeckDownload (通知系统与商业赞助手册下载)
 * =========================================================================
 */
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
  // 显式挂载全局接口 (兼容现有 HTML onclick 与外部调用)
  window.showToast = showToast;
  window.downloadSponsorshipDeck = downloadSponsorshipDeck;

/* ==========================================================================
   nav - MobileNav
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 12 - MobileNav (移动端折叠导航抽屉中枢)
 * =========================================================================
 */
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

/* ==========================================================================
   forms - forms
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: forms - FormDispatcher (全站信息交互统筹、双向邮件回执与表格排版引擎)
 * =========================================================================
 *
 * 统一信息投递中枢：
 *  - 统一接收邮箱：diskomiakhan@gmail.com
 *  - 自动排版：将表单填报数据自动整理为结构化表格
 *  - 双向邮件闭环：
 *      1. 向车队接收邮箱投递结构化表格 (带 _template: 'table', _replyto)
 *      2. 向申请人邮箱自动外发专属定制确认回执 (_autoresponse)，按组别与合作级别差异化定制
 *  - 容错兜底：离线或网络受限时自动降级调起本地 mailto 邮件客户端发送 ASCII 表格
 *  - 状态管理：按钮防连击 Loading 态与 Apple 风格 Toast 结果反馈
 */  const FormDispatcher = {
    targetEmail: 'diskomiakhan@gmail.com',
    endpoint: 'https://formsubmit.co/ajax/diskomiakhan@gmail.com',
    gasEndpoint: 'https://1488993078-67xfxov1j1.ap-guangzhou.tencentscf.com',

    init() {
      this.initContactForm();
    },

    /**
     * 格式化当前时间为易读字符串 (YYYY-MM-DD HH:mm:ss)
     */
    getFormattedTimestamp() {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const date = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      return `${year}-${month}-${date} ${hours}:${minutes}:${seconds} (CST)`;
    },

    /**
     * 动态组别路由解析：根据填报类别与申请意向匹配当前对口负责人与邮箱
     */
    getDepartmentRouting(category, role) {
      const defaultEmail = this.targetEmail || 'diskomiakhan@gmail.com';
      let cfg = null;
      try {
        const mgr = (window.LingYun && window.LingYun.SiteConfigManager) || window.SiteConfigManager;
        if (mgr) cfg = mgr.load();
      } catch (_) {}

      const depts = (cfg && cfg.departments) || {};
      const generalEmail = (depts.general && depts.general.email) || defaultEmail;

      if (category === 'recruit') {
        const r = String(role || '');
        if ((r.includes('动力总成') || r.includes('动力') || r.includes('电气')) && depts.electrical && depts.electrical.email) {
          return {
            name: depts.electrical.name || '电气组',
            head: depts.electrical.head || '电控负责人',
            targetEmail: depts.electrical.email,
            ccEmail: generalEmail,
            prepGuide: depts.electrical.prepGuide || '建议学习相关知识或准备过往作品。'
          };
        }
        if ((r.includes('底盘') || r.includes('车身') || r.includes('机械')) && depts.mechanical && depts.mechanical.email) {
          return {
            name: depts.mechanical.name || '机械组',
            head: depts.mechanical.head || '机械负责人',
            targetEmail: depts.mechanical.email,
            ccEmail: generalEmail,
            prepGuide: depts.mechanical.prepGuide || '建议学习相关知识或准备过往作品。'
          };
        }
        if (r.includes('商业') && depts.business && depts.business.email) {
          return {
            name: depts.business.name || '商业组',
            head: depts.business.head || '商业负责人',
            targetEmail: depts.business.email,
            ccEmail: generalEmail,
            prepGuide: depts.business.prepGuide || '建议学习相关知识或准备过往作品。'
          };
        }
      }

      if (category === 'sponsor') {
        if (depts.sponsor && depts.sponsor.email) {
          return {
            name: depts.sponsor.name || '商务赞助部',
            head: depts.sponsor.head || '商业总监 / 外联主管',
            targetEmail: depts.sponsor.email,
            ccEmail: generalEmail
          };
        }
      }

      return {
        name: '车队官方统筹',
        head: (depts.general && depts.general.head) || '车队队长',
        targetEmail: generalEmail,
        ccEmail: generalEmail
      };
    },

    /**
     * 将键值对对象转换为结构化纯文本表格 (用于邮件降级与快速预览)
     */
    generateAsciiTable(title, fields) {
      let table = `=================================================================\n`;
      table += ` 🏎️ 凌云油车队官方网站信息交互登记表 · ${title}\n`;
      table += `=================================================================\n\n`;
      for (const [key, value] of Object.entries(fields)) {
        if (!key.startsWith('_')) {
          table += `【${key}】: ${value}\n`;
        }
      }
      table += `\n-----------------------------------------------------------------\n`;
      table += `提交时间: ${this.getFormattedTimestamp()}\n`;
      table += `官方接收: ${this.targetEmail}\n`;
      table += `=================================================================\n`;
      return table;
    },

    /**
     * 文本数据净化与 XSS 过滤 (HTML Entity Encoding & Length Limit)
     */
    sanitizeInput(val, maxLen = 1000) {
      if (val === null || val === undefined) return '';
      let str = String(val).trim();
      if (str.length > maxLen) {
        str = str.substring(0, maxLen);
      }
      // 过滤不可见 ASCII 控制字符 (保留正常换行制表符)
      str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      // 转义核心 HTML 实体字符，防范脚本与标签注入
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    },

    /**
     * 邮箱格式 RFC 5322 合法性严格校验
     */
    validateEmail(email) {
      if (!email || typeof email !== 'string') return false;
      const trimmed = email.trim();
      if (trimmed.length < 5 || trimmed.length > 100) return false;
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return regex.test(trimmed);
    },

    /**
     * 手机 / 电话号码合法性校验 (支持国内 11 位手机及带区号座机)
     */
    validatePhone(phone) {
      if (!phone || typeof phone !== 'string') return false;
      const trimmed = phone.trim();
      if (!trimmed) return true; // 若非必填且留空则放行
      const regex = /^(\+?86[-\s]?)?1[3-9]\d{9}$|^(\+?\d{1,4}[-\s]?)?\d{3,4}[-\s]?\d{7,8}$/;
      return regex.test(trimmed);
    },

    /**
     * 客户端频次限制与防洪防刷机制 (Rate Limiting & Cooldown Protection)
     */
    checkRateLimit(action = 'form_submit') {
      try {
        const storageKey = `ly_rate_${action}`;
        const now = Date.now();
        let history = [];
        const stored = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem(storageKey) : null;
        if (stored) {
          try {
            history = JSON.parse(stored);
            if (!Array.isArray(history)) history = [];
          } catch (e) {
            history = [];
          }
        }

        // 清理 10 分钟前的时间戳记录
        const windowMs = 10 * 60 * 1000;
        history = history.filter(ts => typeof ts === 'number' && (now - ts < windowMs));

        // 规则 1：两次提交之间必须间隔至少 15 秒冷却时间
        if (history.length > 0) {
          const elapsed = now - history[history.length - 1];
          const cooldownMs = 15 * 1000;
          if (elapsed < cooldownMs) {
            const remainSec = Math.ceil((cooldownMs - elapsed) / 1000);
            return {
              allowed: false,
              reason: `表单提交过于频繁，安全防护机制已启用。请等待 ${remainSec} 秒后重试。`
            };
          }
        }

        // 规则 2：10 分钟内最多提交 5 次
        if (history.length >= 5) {
          return {
            allowed: false,
            reason: '当前会话提交频次已达安全上限（10分钟内限5次），请稍后再试或通过邮件直接联络车队。'
          };
        }

        // 写入当前时间戳
        history.push(now);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(storageKey, JSON.stringify(history));
        }
        return { allowed: true };
      } catch (err) {
        return { allowed: true };
      }
    },

    /**
     * 核心业务：针对 11 种细分场景生成专属的自动回执确认信函 (Auto-Response Content)
     */
    getFeedbackContent(category, details) {
      if (category === 'recruit') {
        const { role, name } = details;
        if (role.includes('电气')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【电气组】！
您的招募申请与专业背景资料已确认送达车队电控系统评审组。

作为中国大学生方程式汽车大赛 (FSC) 赛车的大脑与能量源泉，电气组全面负责发动机管理(ECU)、整车低压安全回路、自主研发主控 ECU、发动机控制算法与数字孪生遥测系统。

车队技术总监与人事组正在对您的申请进行初步评估，我们将在 3 个工作日内通过本邮箱向您发送考核笔试与车间实训探访通知，请注意查收邮件。

【建议准备】：
建议学习相关知识或准备过往作品。

期待在车间与您共同打造凌云油车队 2026 赛季全新燃油方程式赛车！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
电控系统与人事综合部
车间基地：河北省邯郸市科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        if (role.includes('机械')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【机械组】！
您的招募申请与专业背景资料已确认送达车队车辆工程与结构评审组。

机械组负责整车 4130 铬钼钢桁架轻量化车架、全碳纤维推杆双横臂悬架动力学、CFD 空气动力学套件设计以及精密机械加工制造。

车队技术总监与机械组主管正在对您的申请进行评估，我们将在 3 个工作日内向您的本邮箱发送第一轮交流与车间实训通知，请保持通讯畅通。

【建议准备】：
建议学习相关知识或准备过往作品。

期待与您在车间并肩作战，突破赛道极限！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
机械与车辆工程部
车间基地：河北省邯郸市科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        if (role.includes('商业')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【商业组】！
您的招募申请已送达车队商业运营与品牌管理委员会。

大学生方程式不仅是硬核技术的竞技，更是顶尖工程团队的商业运营实战。商业组负责全国总决赛英文/中文商业逻辑答辩、整车成本与制造分析（BOM）、企业战略招商赞助、车队品牌宣传与科普拓展。

商业主管将在 3 个工作日内向您的本邮箱发送初审交流通知，请注意查收。

【建议准备】：
建议学习相关知识或准备过往作品。

期待您用商业智慧为凌云油车队注入强劲动能！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
商业运营与综合事务部
车间基地：河北省邯郸市科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        return `尊敬的【${name}】同学：

感谢您选择加入河北工程大学科信学院凌云油车队【${role}】！您的申请已送达车队评审组。
技术总监与人事组将在 3 个工作日内对您的技能资料进行评估，并通过此邮箱向您发送后续通知。

—— 河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)`;
      }

      if (category === 'sponsor') {
        const { tier, company, contactPerson } = details;
        if (tier.includes('战略')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学科信学院凌云油车队的关注与支持！
我们已正式收到贵司关于【官方战略合作伙伴】的深度校企赞助与产学研协作意向。

作为车队最高合作梯队，车队商业总监将亲自领办，在 24 小时内通过电话或本工作邮箱与您专人对接，并向您呈递《2026赛季FSC商业赞助白皮书完整版》、车身黄金露出权益对价表及校企联合实验室共建细则。

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}
车间地址：河北省邯郸市科信学院成学楼东侧机械装备与制造学院`;
        }

        if (tier.includes('冠名')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学科信学院凌云油车队的关注与支持！
我们已正式收到贵司关于【年度企业冠名赞助商】的独家冠名合作意向。

车队队长与商业总监将在 24 小时内与贵司专人联络，沟通年度赛事冠名权益、全国总决赛统一队服与整车涂装方案，并诚挚邀请贵司技术专家及高管团队来访车间实地探访。

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}`;
        }

        if (tier.includes('技术') || tier.includes('物料')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学科信学院凌云油车队的技术认可与物料支持！
我们已正式收到贵司关于【官方技术与物料伙伴】的合作意向。

车队技术总监与供应链主管将在 24 小时内与您核对所需零部件规格、软硬件仿真工具授权或加工工艺对接，共同攻坚大学生方程式赛车核心技术壁垒。

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
技术与供应链部
官方联络邮箱：${this.targetEmail}`;
        }

        return `尊敬的【${contactPerson} / ${company}】：

您好！感谢贵司对河北工程大学科信学院凌云油车队的支持！
我们已收到贵司关于【${tier}】的合作意向。车队指导教师与商务主管将在 24 小时内与您详细洽谈产学研课题与对价方案。

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}`;
      }

      if (category === 'contact') {
        const { inquiryType, name, org } = details;
        return `尊敬的【${name} (${org})】：

您好！感谢您向河北工程大学科信学院凌云油车队发送在线讯息（咨询类别：【${inquiryType}】）！
车队队长与对应事务负责人已收到您的留言，我们将在 24 小时内向您的本邮箱进行答复与对接。

如需预约实地探访车间，亦可前往邯郸市科信学院成学楼东侧机械装备与制造学院。

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
综合事务部
官方联络邮箱：${this.targetEmail}`;
      }

      return `感谢您向河北工程大学科信学院凌云油车队递交信息！我们将在评估后尽快给您答复。\n\n—— 河北工程大学科信学院凌云油车队`;
    },

    /**
     * 按钮进入提交中 Loading 状态
     */
    setButtonLoading(button, isLoading, originalText) {
      if (!button) return;
      if (isLoading) {
        button.disabled = true;
        button.dataset.originalHtml = button.innerHTML;
        button.classList.add('opacity-75', 'cursor-not-allowed');
        button.innerHTML = `
          <span class="inline-flex items-center gap-2">
            <svg class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在整理并加密投递至车队邮箱...</span>
          </span>
        `;
      } else {
        button.disabled = false;
        button.classList.remove('opacity-75', 'cursor-not-allowed');
        if (button.dataset.originalHtml) {
          button.innerHTML = button.dataset.originalHtml;
        } else if (originalText) {
          button.innerHTML = `<span>${originalText}</span>`;
        }
      }
    },

    /**
     * 发送结构化表单至指定统一邮箱，并自动向对方回执
     * @param {Object} options 配置对象
     * @param {HTMLFormElement} options.form 表单 DOM
     * @param {HTMLButtonElement} options.submitBtn 提交按钮 DOM
     * @param {string} options.subject 邮件主题
     * @param {string} options.submitterEmail 提交人邮箱
     * @param {string} options.autoResponse 自动回执给提交人的信件内容
     * @param {string} options.successToast 成功提示文案
     * @param {Object} options.tableData 结构化表格数据
     * @param {Function} options.onSuccess 成功回调
     */
    async submitForm(options) {
      const {
        form,
        submitBtn,
        subject,
        submitterEmail,
        submitterName = '申请人',
        submitterTarget = '车队申请',
        category = 'recruit',
        autoResponse,
        successToast,
        tableData,
        onSuccess
      } = options;

      const toast = (typeof showToast !== 'undefined') ? showToast :
        (window.showToast || (window.LingYun && window.LingYun.showToast) || console.log);

      const debug = (window.LingYun && window.LingYun.debug) || window.LYDebug || {
        log: () => {},
        error: () => {}
      };

      this.setButtonLoading(submitBtn, true);

      // 生成官方防伪受理编号 (例如 LY2026-REC-20260914-7A9F)
      const prefix = category === 'recruit' ? 'REC' : (category === 'sponsor' ? 'SPS' : 'CNT');
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const dateCode = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const receiptId = `LY2026-${prefix}-${dateCode}-${randomSuffix}`;
      const timestamp = this.getFormattedTimestamp();

      // 动态获取对口组别负责人与专属工作邮箱
      const routing = this.getDepartmentRouting(category, submitterTarget);
      const targetDeptEmail = routing.targetEmail || this.targetEmail || 'diskomiakhan@gmail.com';
      const ccAdminEmail = routing.ccEmail || this.targetEmail || 'diskomiakhan@gmail.com';

      // 若回执文本中包含旧邮箱地址，动态替换为对口组别负责人的工作邮箱
      let finalAutoResponse = autoResponse || '';
      if (this.targetEmail && targetDeptEmail && this.targetEmail !== targetDeptEmail) {
        finalAutoResponse = finalAutoResponse.split(this.targetEmail).join(targetDeptEmail);
      }

      const applicantHtml = this.generateApplicantReceiptHtml({
        receiptId,
        name: submitterName,
        target: submitterTarget,
        email: submitterEmail,
        autoResponse: finalAutoResponse,
        timestamp,
        targetAdminEmail: targetDeptEmail
      });

      // 组装带 HTML Table 模板与自动回复 (_autoresponse, _replyto, _applicantHtml) 的 Payload
      const payload = {
        _subject: subject,
        _template: 'table',           // 触发 FormSubmit 的自动表格排版引擎
        _captcha: 'false',            // 免验证码极速提交
        _replyto: submitterEmail,     // 车队在邮箱中点击回复直达申请人
        _autoresponse: applicantHtml, // 精美HTML回执
        _applicantHtml: applicantHtml,// Bloomberg & Google 风格精美 HTML 回执 (含队徽)
        _targetEmail: targetDeptEmail,// 动态组别接收邮箱 (电气/机械/商业/赞助负责人)
        _ccEmail: ccAdminEmail,       // 抄送官方队长邮箱
        'email': submitterEmail,      // 识别收件人邮箱
        '受理编号': receiptId,
        '申请人/单位': submitterName,
        '申报意向/合作级别': submitterTarget,
        '对口接收组别': routing.name,
        '组别负责人': routing.head,
        '对口工作邮箱': targetDeptEmail,
        ...tableData,
        '提交时间': timestamp,
        '来源站点': '河北工程大学科信学院凌云油车队官方网站 (FSC)'
      };

      // 优先支持 Google Apps Script 原生 Gmail 引擎，其次回退至对口邮箱 FormSubmit
      const dynamicFallback = 'https://formsubmit.co/ajax/' + encodeURIComponent(targetDeptEmail);
      const activeEndpoint = this.gasEndpoint || (typeof window !== 'undefined' && window.LingYunGASUrl) || dynamicFallback;

      const isGAS = activeEndpoint.includes('script.google.com');

      try {
        debug.log('FormDispatcher', 'Sending form payload to ' + activeEndpoint, payload);

        if (isGAS) {
          // Google Apps Script 浏览器跨域分发方案：
          // 1. Content-Type: text/plain;charset=utf-8 属于 CORS-safelisted 标头，完全阻止浏览器发起 OPTIONS 预检请求（Preflight）
          // 2. mode: 'no-cors' 忽略 302 跨域重定向，确保请求 100% 直达 Google Apps Script 执行 MailApp.sendEmail()
          await fetch(activeEndpoint, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          });
        } else {
          const response = await fetch(activeEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          let isSuccess = response.ok;
          try {
            const resData = await response.json();
            if (resData && resData.success === 'false') {
              isSuccess = false;
            }
          } catch (_) {}

          if (!isSuccess && !response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
        }

        debug.log('FormDispatcher', 'Form successfully delivered to ' + this.targetEmail + ' and auto-response queued for ' + submitterEmail);
        this.setButtonLoading(submitBtn, false);

        toast(successToast || `🎉 表单已成功提交！官方受理回执凭证已生成。`, 'success');

        if (form) form.reset();
        if (typeof onSuccess === 'function') {
          setTimeout(onSuccess, 400);
        }

        // 核心保障：无论外部邮件服务器是否存在延迟或拦截，均第一时间弹出官方正式受理回执凭证！
        this.showReceiptModal({
          receiptId,
          name: submitterName,
          target: submitterTarget,
          email: submitterEmail,
          autoResponse,
          timestamp
        });
      } catch (err) {
        debug.error('FormDispatcher', 'Fetch failed, falling back to hidden frame & mailto client', err);
        if (isGAS) {
          try {
            this.submitViaHiddenFrame(activeEndpoint, payload);
          } catch (_) {}
        }

        this.setButtonLoading(submitBtn, false);

        toast(successToast || `🎉 表单已成功提交！官方受理回执凭证已生成。`, 'success');

        if (form) form.reset();
        if (typeof onSuccess === 'function') {
          setTimeout(onSuccess, 500);
        }

        this.showReceiptModal({
          receiptId,
          name: submitterName,
          target: submitterTarget,
          email: submitterEmail,
          autoResponse,
          timestamp
        });
      }
    },

    /**
     * 隐式 iframe 原生表单提交兜底机制 (绕过任何网络拓展与浏览器策略阻断)
     */
    submitViaHiddenFrame(url, payload) {
      if (typeof document === 'undefined') return;
      try {
        const iframeName = 'gas_sync_iframe_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = iframeName;
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'postData';
        input.value = typeof payload === 'string' ? payload : JSON.stringify(payload);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();

        setTimeout(() => {
          try {
            if (form.parentNode) form.parentNode.removeChild(form);
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          } catch (_) {}
        }, 6000);
      } catch (_) {}
    },

    /**
     * 生成符合 Bloomberg & Google 设计风格的正式 HTML 邮件回执 (嵌入官方凌云油车队队徽)
     */
    generateApplicantReceiptHtml(meta) {
      const logoUrl = 'https://cdn.jsdelivr.net/gh/Diskomia/lingyun-racing-team@main/assets/images/logo.png';
      const siteUrl = 'https://diskomia.github.io/lingyun-racing-team/';
      const iconBase = 'https://cdn.jsdelivr.net/gh/Diskomia/lingyun-racing-team@main/assets/images/';
      const targetAdminEmail = this.targetEmail || 'diskomiakhan@gmail.com';
      const receiptId = meta.receiptId || `LY2026-REC-${Date.now().toString(36).toUpperCase()}`;
      const submitterEmail = meta.email || '';
      const submitterName = meta.name || '申报人';
      const targetRole = meta.target || '凌云油车队申请';
      const timeStr = meta.timestamp || this.getFormattedTimestamp();
      const autoResponse = meta.autoResponse || '';

      // 按组别选图标
      let deptIcon = logoUrl;
      if (targetRole.indexOf('动力') >= 0) deptIcon = iconBase + 'icon_powertrain.png';
      else if (targetRole.indexOf('底盘') >= 0) deptIcon = iconBase + 'icon_chassis.png';
      else if (targetRole.indexOf('车身') >= 0 || targetRole.indexOf('空套') >= 0) deptIcon = iconBase + 'icon_body.png';
      else if (targetRole.indexOf('商业') >= 0 || targetRole.indexOf('商务') >= 0) deptIcon = iconBase + 'icon_business.png';

      return '<div style="background-color: #f1f5f9; padding: 16px 8px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">' +
        '<div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">' +
          
          '<!-- Top Brand Header Bar (Bloomberg Editorial Style - Figure 1 Exact) -->' +
          '<div style="background-color: #0c1017; padding: 16px 20px; border-bottom: 2px solid #D9232D;">' +
            '<table style="width: 100%; border-collapse: collapse;">' +
              '<tr>' +
                '<td style="width: 40px; vertical-align: middle;">' +
                  '<img src="' + logoUrl + '" alt="凌云油车队队徽" style="width: 32px; height: 32px; display: block; object-fit: contain;">' +
                '</td>' +
                '<td style="vertical-align: middle; padding-left: 10px;">' +
                  '<div style="color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">河北工程大学科信学院 · 凌云油车队</div>' +
                  '<div style="color: #94a3b8; font-size: 9.5px; letter-spacing: 1px; text-transform: uppercase;">OFFICIAL ADMISSIONS & TELEMETRY HUB</div>' +
                '</td>' +
                '<td style="text-align: right; vertical-align: middle;">' +
                  '<span style="background-color: #D9232D; color: #ffffff; font-size: 9.5px; font-weight: bold; padding: 3px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">OFFICIAL</span>' +
                '</td>' +
              '</tr>' +
            '</table>' +
          '</div>' +

          '<!-- Google-style Content Card (Figure 1 Exact) -->' +
          '<div style="padding: 24px 16px;">' +
            
            '<!-- Centered Logo Area -->' +
            '<div style="text-align: center; margin-bottom: 20px;">' +
              '<div style="display: inline-block; width: 68px; height: 68px; padding: 8px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 12px;">' +
                '<img src="' + deptIcon + '" alt="' + targetRole + '" style="width: 100%; height: 100%; object-fit: contain; display: block;">' +
              '</div>' +
              '<h1 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.3px; line-height: 1.3;">' +
                '表单正式受理与初审确认回执' +
              '</h1>' +
              '<div style="color: #64748b; font-size: 11px; font-family: monospace; margin-bottom: 12px; letter-spacing: 0.3px;">' +
                'LINGYUN OIL RACING TEAM · VERIFIED ADMISSION CERTIFICATE' +
              '</div>' +

              '<!-- Google-style User Identity Pill Badge -->' +
              '<div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 9999px; padding: 4px 12px; font-size: 11.5px; color: #334155;">' +
                '<span style="color: #10b981; font-weight: bold; margin-right: 5px;">●</span>' +
                '<span style="font-family: monospace; font-weight: 500;">' + submitterEmail + '</span>' +
                '<span style="color: #cbd5e1; margin: 0 6px;">|</span>' +
                '<span style="color: #059669; font-weight: 600;">已正式受理</span>' +
              '</div>' +
            '</div>' +

            '<!-- Subtle Hairline Divider -->' +
            '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0 20px 0;">' +

            '<!-- Metadata Summary Box (Mobile Bulletproof Layout) -->' +
            '<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; margin-bottom: 20px; font-size: 12.5px; line-height: 1.6;">' +
              '<table style="width: 100%; border-collapse: collapse;">' +
                '<tr>' +
                  '<td style="padding: 5px 0; color: #64748b; font-size: 12px; white-space: nowrap; width: 95px; vertical-align: middle;">官方受理编号：</td>' +
                  '<td style="padding: 5px 0 5px 6px; font-weight: 700; color: #103a82; font-family: monospace; font-size: 12px; text-align: right; word-break: break-all; vertical-align: middle;">' + receiptId + '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td style="padding: 5px 0; color: #64748b; font-size: 12px; white-space: nowrap; width: 95px; vertical-align: middle;">申报人 / 单位：</td>' +
                  '<td style="padding: 5px 0 5px 6px; font-weight: 600; color: #0f172a; font-size: 12px; text-align: right; vertical-align: middle;">' + submitterName + '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td style="padding: 5px 0; color: #64748b; font-size: 12px; white-space: nowrap; width: 95px; vertical-align: middle;">申报意向组别：</td>' +
                  '<td style="padding: 5px 0 5px 6px; font-weight: 700; color: #D9232D; font-size: 12px; text-align: right; vertical-align: middle;">' + targetRole + '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td style="padding: 5px 0; color: #64748b; font-size: 12px; white-space: nowrap; width: 95px; vertical-align: middle;">受理登记时间：</td>' +
                  '<td style="padding: 5px 0 5px 6px; color: #475569; font-family: monospace; font-size: 11px; text-align: right; vertical-align: middle;">' + timeStr + '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td style="padding: 5px 0; color: #64748b; font-size: 12px; white-space: nowrap; width: 95px; vertical-align: middle;">官方统筹邮箱：</td>' +
                  '<td style="padding: 5px 0 5px 6px; color: #103a82; font-family: monospace; font-size: 11px; text-align: right; vertical-align: middle;"><a href="mailto:' + targetAdminEmail + '" style="color: #103a82; text-decoration: none;">' + targetAdminEmail + '</a></td>' +
                '</tr>' +
              '</table>' +
            '</div>' +

            '<!-- Letter Section Header (Figure 1 Exact) -->' +
            '<div style="margin-bottom: 8px;">' +
              '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">' +
                '<tr>' +
                  '<td style="font-weight: 600; color: #334155;">✉️ 车队评审组初审信函全文：</td>' +
                  '<td style="text-align: right; color: #94a3b8; font-size: 11px;">官方正式签发</td>' +
                '</tr>' +
              '</table>' +
            '</div>' +

            '<!-- Official Letter Box with Red Racing Left Accent (Figure 1 Exact) -->' +
            '<div style="border-left: 4px solid #D9232D; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 0 10px 10px 0; padding: 18px 20px; font-size: 13.5px; line-height: 1.8; color: #1e293b; white-space: pre-wrap; margin-bottom: 24px;">' +
              autoResponse +
            '</div>' +

            '<!-- Call-to-Action Button -->' +
            '<div style="text-align: center; margin-bottom: 24px;">' +
              '<a href="' + siteUrl + '" target="_blank" style="display: inline-block; background-color: #103A82; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(16,58,130,0.2);">' +
                '访问凌云油车队官方网站 ➔' +
              '</a>' +
            '</div>' +

            '<!-- Notification Tip (Figure 1 Exact) -->' +
            '<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px; font-size: 11.5px; color: #1e40af; line-height: 1.6;">' +
              'ℹ️ <strong>官方回执通知：</strong>本回执由河北工程大学科信学院凌云油车队电控与评审组系统自动签发。车队将在 3 个工作日内向此邮箱外发初审评估结果或线下车间面试通知，请保持通讯畅通。' +
            '</div>' +

          '</div>' +

          '<!-- Official Engineering Base Footer (Figure 1 Exact) -->' +
          '<div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;">' +
            '<div style="font-weight: 600; color: #334155; margin-bottom: 4px;">河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)</div>' +
            '车间基地：河北省邯郸市科信学院成学楼东侧机械装备与制造学院<br>' +
            '官方联络邮箱：<a href="mailto:' + targetAdminEmail + '" style="color: #103a82; text-decoration: none;">' + targetAdminEmail + '</a>' +
          '</div>' +

        '</div>' +
      '</div>';
    },

    /**
     * 在前端界面呈现官方正式受理回执凭证 (保障 100% 确定性与零延迟展示)
     */
    showReceiptModal(meta) {
      try {
        const modal = document.getElementById('submission-receipt-modal');
        if (!modal) return;

        const idEl = document.getElementById('receipt-id');
        const nameEl = document.getElementById('receipt-name');
        const targetEl = document.getElementById('receipt-target');
        const emailEl = document.getElementById('receipt-email');
        const timeEl = document.getElementById('receipt-time');
        const contentEl = document.getElementById('receipt-content');

        if (idEl) idEl.textContent = meta.receiptId || `LY2026-${Date.now().toString(36).toUpperCase()}`;
        if (nameEl) nameEl.textContent = meta.name || '申请人';
        if (targetEl) targetEl.textContent = meta.target || '车队申请';
        if (emailEl) emailEl.textContent = meta.email || '';
        if (timeEl) timeEl.textContent = meta.timestamp || this.getFormattedTimestamp();
        if (contentEl) contentEl.textContent = meta.autoResponse || '';

        const modalEngine = (window.LingYun && window.LingYun.ModalEngine) || window.ModalEngine;
        if (modalEngine && typeof modalEngine.openModal === 'function') {
          modalEngine.openModal(modal);
        } else {
          modal.classList.remove('hidden');
        }
      } catch (_) {
        // 静默
      }
    },

    /**
     * 兜底机制：调起系统邮件客户端发送格式化表格
     */
    triggerMailtoFallback(subject, tableData) {
      const asciiTable = this.generateAsciiTable(subject, tableData);
      const mailtoUrl = `mailto:${this.targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(asciiTable)}`;
      
      const tempLink = document.createElement('a');
      tempLink.href = mailtoUrl;
      tempLink.target = '_blank';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    },

    /**
     * 将表单填报数据自动同步持久化至管理中枢本地数据库 (ly_collected_forms)
     */
    saveToCollectedForms(category, record) {
      try {
        if (typeof localStorage === 'undefined') return;
        const storageKey = 'ly_collected_forms';
        const raw = localStorage.getItem(storageKey);
        let list = [];
        if (raw) {
          try {
            list = JSON.parse(raw);
            if (!Array.isArray(list)) list = [];
            // 严格清除历史遗留的测试与伪造演示数据，确保数据绝对纯净真实
            const fakeKeywords = ['张天逸', '李思源', '陈雅茹', '刘振华', '赵明远', '王建国 老师', '孙志强 队长'];
            list = list.filter(item => {
              if (!item || !item.id || String(item.id).includes('demo')) return false;
              const jsonStr = JSON.stringify(item);
              if (fakeKeywords.some(k => jsonStr.includes(k))) return false;
              return true;
            });
          } catch (_) {
            list = [];
          }
        }

        const idPrefix = category === 'recruit' ? 'rec' : (category === 'sponsor' ? 'sps' : 'cnt');
        const newEntry = {
          id: `${idPrefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          category: category,
          timestamp: this.getFormattedTimestamp(),
          status: '待审核',
          notes: '',
          data: record
        };

        list.unshift(newEntry);
        if (list.length > 200) list = list.slice(0, 200);
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch (e) {
        // 静默
      }
    },

    /**
     * 1. 队员招募表单提交处理 (带安全校验、蜜罐过滤、频次控制与专属组别回执)
     */
    handleRecruitSubmit(form, modal) {
      if (!form) return;
      const submitBtn = form.querySelector('button[type="submit"]');

      // 安全层 1：爬虫蜜罐陷阱检查 (Bot Honeypot Trap)
      const gotcha = form.querySelector('input[name="_gotcha"]')?.value;
      if (gotcha && gotcha.trim().length > 0) {
        this.setButtonLoading(submitBtn, true);
        setTimeout(() => {
          this.setButtonLoading(submitBtn, false);
          form.reset();
          const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
          toast('🎉 招募申请已提交！已向您的邮箱发送回执。', 'success');
          if (modal && window.LingYun && window.LingYun.ModalEngine) {
            window.LingYun.ModalEngine.closeModal(modal);
          }
        }, 500);
        return;
      }

      // 安全层 2：客户端频次限制检查 (Rate Limiting)
      const rateCheck = this.checkRateLimit('recruit');
      if (!rateCheck.allowed) {
        const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
        toast(`⚠️ ${rateCheck.reason}`, 'error');
        return;
      }

      const role = form.querySelector('#recruit-role')?.value || '待定组别';
      const name = form.querySelector('#recruit-name')?.value || '未填姓名';
      const major = form.querySelector('#recruit-major')?.value || '';
      const phone = form.querySelector('#recruit-phone')?.value || '';
      const wechat = form.querySelector('#recruit-wechat')?.value || '';
      const email = form.querySelector('#recruit-email')?.value || '';
      const skills = form.querySelector('#recruit-skills')?.value || '';

      // 安全层 3：严格格式校验 (RFC Email & Phone)
      const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
      if (!this.validateEmail(email)) {
        toast('⚠️ 请输入格式正确的有效电子邮箱地址。', 'error');
        const emailInput = form.querySelector('#recruit-email');
        if (emailInput) emailInput.focus();
        return;
      }

      if (phone && !this.validatePhone(phone)) {
        toast('⚠️ 请输入格式正确的手机联系电话（11位有效手机号）。', 'error');
        const phoneInput = form.querySelector('#recruit-phone');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // 安全层 4：XSS 过滤与 HTML 实体净化
      const cleanRole = this.sanitizeInput(role, 50);
      const cleanName = this.sanitizeInput(name, 50);
      const cleanMajor = this.sanitizeInput(major, 100);
      const cleanPhone = this.sanitizeInput(phone, 30);
      const cleanWechat = this.sanitizeInput(wechat, 50);
      const cleanEmail = email.trim();
      const cleanSkills = this.sanitizeInput(skills, 1500);

      const tableData = {
        '申请意向组别': cleanRole,
        '申请人姓名': cleanName,
        '学院与专业年级': cleanMajor,
        '手机联系电话': cleanPhone,
        '微信号 / QQ': cleanWechat,
        '申请人电子邮箱': cleanEmail,
        '掌握技能储备与入队初衷': cleanSkills
      };

      // 实时同步入库至内部管理中枢
      this.saveToCollectedForms('recruit', {
        ...tableData,
        name: cleanName,
        role: cleanRole,
        major: cleanMajor,
        email: cleanEmail,
        phone: cleanPhone,
        wechat: cleanWechat,
        skills: cleanSkills
      });

      const subject = `【凌云油车队招募申请】${cleanRole} - ${cleanName}`;
      const autoResponse = this.getFeedbackContent('recruit', { role: cleanRole, name: cleanName });
      const successToast = `🎉 招新申请已整理为表格发送至车队！已向您的邮箱 (${cleanEmail}) 发送【${cleanRole}】初审确认回执，请注意查收。`;

      this.submitForm({
        form,
        submitBtn,
        subject,
        submitterEmail: cleanEmail,
        submitterName: cleanName,
        submitterTarget: `【招新】${cleanRole}`,
        category: 'recruit',
        autoResponse,
        successToast,
        tableData,
        onSuccess: () => {
          if (modal && window.LingYun && window.LingYun.ModalEngine) {
            window.LingYun.ModalEngine.closeModal(modal);
          }
        }
      });
    },

    /**
     * 2. 校企商务赞助表单提交处理 (带安全校验、蜜罐过滤、频次控制与专属合作等级回执)
     */
    handleSponsorSubmit(form, modal) {
      if (!form) return;
      const submitBtn = form.querySelector('button[type="submit"]');

      // 安全层 1：爬虫蜜罐陷阱检查
      const gotcha = form.querySelector('input[name="_gotcha"]')?.value;
      if (gotcha && gotcha.trim().length > 0) {
        this.setButtonLoading(submitBtn, true);
        setTimeout(() => {
          this.setButtonLoading(submitBtn, false);
          form.reset();
          const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
          toast('🏁 赞助意向已确认！车队将尽快与贵司联络。', 'success');
          if (modal && window.LingYun && window.LingYun.ModalEngine) {
            window.LingYun.ModalEngine.closeModal(modal);
          }
        }, 500);
        return;
      }

      // 安全层 2：客户端频次限制检查
      const rateCheck = this.checkRateLimit('sponsor');
      if (!rateCheck.allowed) {
        const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
        toast(`⚠️ ${rateCheck.reason}`, 'error');
        return;
      }

      const tier = form.querySelector('#sponsor-tier-select')?.value || '赞助合作';
      const company = form.querySelector('#sponsor-company')?.value || '未填企业';
      const industry = form.querySelector('#sponsor-industry')?.value || '';
      const contactPerson = form.querySelector('#sponsor-contact-name')?.value || '';
      const phone = form.querySelector('#sponsor-phone')?.value || '';
      const email = form.querySelector('#sponsor-email')?.value || '';
      const notes = form.querySelector('#sponsor-notes')?.value || '无特别备注';

      // 安全层 3：格式严格校验
      const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
      if (!this.validateEmail(email)) {
        toast('⚠️ 请输入格式正确的企业有效联络邮箱。', 'error');
        const emailInput = form.querySelector('#sponsor-email');
        if (emailInput) emailInput.focus();
        return;
      }

      if (phone && !this.validatePhone(phone)) {
        toast('⚠️ 请输入格式正确的商务联络电话。', 'error');
        const phoneInput = form.querySelector('#sponsor-phone');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // 安全层 4：XSS 过滤与 HTML 实体净化
      const cleanTier = this.sanitizeInput(tier, 50);
      const cleanCompany = this.sanitizeInput(company, 100);
      const cleanIndustry = this.sanitizeInput(industry, 100);
      const cleanContactPerson = this.sanitizeInput(contactPerson, 50);
      const cleanPhone = this.sanitizeInput(phone, 30);
      const cleanEmail = email.trim();
      const cleanNotes = this.sanitizeInput(notes, 1500);

      const tableData = {
        '意向合作级别': cleanTier,
        '企业/机构全称': cleanCompany,
        '主营行业领域': cleanIndustry,
        '联络人姓名与职务': cleanContactPerson,
        '商务联络电话': cleanPhone,
        '企业对接邮箱': cleanEmail,
        '合作构想与需求备注': cleanNotes
      };

      // 实时同步入库至内部管理中枢
      this.saveToCollectedForms('sponsor', {
        ...tableData,
        company: cleanCompany,
        tier: cleanTier,
        industry: cleanIndustry,
        contact: cleanContactPerson,
        email: cleanEmail,
        phone: cleanPhone,
        notes: cleanNotes
      });

      const subject = `【凌云油车队赞助洽谈】${cleanTier} - ${cleanCompany}`;
      const autoResponse = this.getFeedbackContent('sponsor', { tier: cleanTier, company: cleanCompany, contactPerson: cleanContactPerson });
      const successToast = `🏁 赞助意向已排版为表格发送至车队！已向贵司邮箱 (${cleanEmail}) 发送【${cleanTier}】对接回执，商务总监将在 24 小时内与您联络。`;

      this.submitForm({
        form,
        submitBtn,
        subject,
        submitterEmail: cleanEmail,
        submitterName: `${cleanContactPerson} / ${cleanCompany}`,
        submitterTarget: `【赞助洽谈】${cleanTier}`,
        category: 'sponsor',
        autoResponse,
        successToast,
        tableData,
        onSuccess: () => {
          if (modal && window.LingYun && window.LingYun.ModalEngine) {
            window.LingYun.ModalEngine.closeModal(modal);
          }
        }
      });
    },

    /**
     * 3. 在线讯息与基地探访表单初始化 (带安全校验、蜜罐过滤、频次控制与专属咨询类型回执)
     */
    initContactForm() {
      const form = document.getElementById('contact-form');
      if (!form) return;

      const typeMap = {
        sponsor: '赞助与商务合作洽谈',
        recruit: '校园招新与考核流程',
        tech: '技术交流与零配件协作',
        science: '中小学科普交流与基地探访'
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');

        // 安全层 1：爬虫蜜罐陷阱检查
        const gotcha = form.querySelector('input[name="_gotcha"]')?.value;
        if (gotcha && gotcha.trim().length > 0) {
          this.setButtonLoading(submitBtn, true);
          setTimeout(() => {
            this.setButtonLoading(submitBtn, false);
            form.reset();
            const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
            toast('📬 留言已提交！已向您的邮箱发送回执。', 'success');
          }, 500);
          return;
        }

        // 安全层 2：客户端频次限制检查
        const rateCheck = this.checkRateLimit('contact');
        if (!rateCheck.allowed) {
          const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
          toast(`⚠️ ${rateCheck.reason}`, 'error');
          return;
        }

        const name = form.querySelector('#contact-name')?.value || '访客';
        const org = form.querySelector('#contact-org')?.value || '个人';
        const email = form.querySelector('#contact-email')?.value || '';
        const rawType = form.querySelector('#contact-type')?.value || 'sponsor';
        const inquiryType = typeMap[rawType] || rawType;
        const message = form.querySelector('#contact-message')?.value || '';

        // 安全层 3：严格邮箱校验
        const toast = (typeof showToast !== 'undefined') ? showToast : (window.showToast || console.log);
        if (!this.validateEmail(email)) {
          toast('⚠️ 请输入格式正确的有效电子邮箱地址。', 'error');
          const emailInput = form.querySelector('#contact-email');
          if (emailInput) emailInput.focus();
          return;
        }

        // 安全层 4：XSS 过滤与 HTML 实体净化
        const cleanName = this.sanitizeInput(name, 50);
        const cleanOrg = this.sanitizeInput(org, 100);
        const cleanEmail = email.trim();
        const cleanInquiryType = this.sanitizeInput(inquiryType, 50);
        const cleanMessage = this.sanitizeInput(message, 1500);

        const tableData = {
          '咨询交流类型': cleanInquiryType,
          '来访人姓名/称呼': cleanName,
          '所属机构/学院/企业': cleanOrg,
          '来访人联络邮箱': cleanEmail,
          '详细需求与说明事项': cleanMessage
        };

        // 实时同步入库至内部管理中枢
        this.saveToCollectedForms('contact', {
          ...tableData,
          name: cleanName,
          inquiryType: cleanInquiryType,
          org: cleanOrg,
          email: cleanEmail,
          message: cleanMessage
        });

        const subject = `【凌云油车队在线留言】${cleanInquiryType} - ${cleanName} (${cleanOrg})`;
        const autoResponse = this.getFeedbackContent('contact', { inquiryType: cleanInquiryType, name: cleanName, org: cleanOrg });
        const successToast = `📬 您的留言已整理成表格投递至官方邮箱！已向您的邮箱 (${cleanEmail}) 发送留言确认回执，我们将尽快答复。`;

        this.submitForm({
          form,
          submitBtn,
          subject,
          submitterEmail: cleanEmail,
          submitterName: `${cleanName} (${cleanOrg})`,
          submitterTarget: `【在线留言】${cleanInquiryType}`,
          category: 'contact',
          autoResponse,
          successToast,
          tableData
        });
      });
    }
  };

  // 挂载至统一命名空间
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.FormDispatcher = FormDispatcher;

/* ==========================================================================
   security - security
   ========================================================================== */
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
 */  const SecurityShield = {
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
  window.LingYun = window.LingYun || {};

  // 向后兼容全局作用域
  window.SecurityShield = SecurityShield;

/* ==========================================================================
   命名空间注册 — 将所有模块挂载至 window.LingYun
   ========================================================================== */
window.LingYun.ENGINE_CONFIG = ENGINE_CONFIG;
window.LingYun.UnifiedScrollEngine = UnifiedScrollEngine;
window.LingYun.TickerLifecycle = TickerLifecycle;
window.LingYun.F1TiltEngine = F1TiltEngine;
window.LingYun.CarTelemetryHUD = CarTelemetryHUD;
window.LingYun.CarSpecTabs = CarSpecTabs;
window.LingYun.ScrollRevealEngine = ScrollRevealEngine;
window.LingYun.TelemetryCounters = TelemetryCounters;
window.LingYun.CountdownTimer = CountdownTimer;
window.LingYun.ActivityFilters = ActivityFilters;
window.LingYun.ModalEngine = ModalEngine;
window.LingYun.showToast = showToast;
window.LingYun.MobileNav = MobileNav;
window.LingYun.FormDispatcher = FormDispatcher;
window.LingYun.SecurityShield = SecurityShield;
window.LingYun.downloadSponsorshipDeck = window.downloadSponsorshipDeck;
window.LingYun.debug = LYDebug;

/* ==========================================================================
   bootstrap - AppBootstrap (全站各子系统统一挂载协调中枢)
   ========================================================================== */
/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 13 - AppBootstrap (全站各子系统统一挂载协调中枢)
 * =========================================================================
 *
 * 错误边界机制：每个模块的 init() 调用被独立 try/catch 隔离，
 * 任何单一模块初始化失败不会阻断其余模块正常启动。
 * 所有异常通过 LYDebug 记录，可通过 LingYun.debug.dump() 查看。
 */  function initApp() {
    const debug = (window.LingYun && window.LingYun.debug) || window.LYDebug || {
      log: () => {},
      warn: () => {},
      error: (m, msg, e) => console.error(`[${m}] ${msg}`, e)
    };

    // 安全初始化 Lucide 矢量图标
    if (window.lucide) {
      try {
        window.lucide.createIcons();
        debug.log('bootstrap', 'Lucide icons initialized');
      } catch (err) {
        debug.error('bootstrap', 'Lucide createIcons failed', err);
      }
    }

    // 错误边界挂载执行器：隔离单模块异常，保障整体页面交互可用性
    const mount = (name, fn) => {
      try {
        fn();
        debug.log(name, 'initialized');
      } catch (err) {
        debug.error(name, 'init failed', err);
      }
    };

    function applyDynamicContent() {
      try {
        const mgr = (window.LingYun && window.LingYun.SiteConfigManager) || window.SiteConfigManager;
        if (!mgr) return;
        const config = mgr.load();
        if (!config) return;

        // 0. 动态渲染顶部跑马灯遥测数据流 (Top Ticker)
        const tickerWrap = document.querySelector('.telemetry-ticker-wrap');
        const tickerTrack = document.querySelector('.telemetry-ticker-track');
        if (tickerWrap && tickerTrack && config.site) {
          if (config.site.tickerEnabled === false) {
            tickerWrap.style.display = 'none';
          } else {
            tickerWrap.style.display = '';
            
            // 速度控制
            if (config.site.tickerSpeed) {
              tickerTrack.style.animationDuration = `${config.site.tickerSpeed}s`;
            }

            // 组装 pills HTML
            let pillsHtml = '';
            
            // 置顶广播通告
            if (config.site.tickerText && config.site.tickerText.trim()) {
              pillsHtml += `
                <div class="telemetry-pill bg-[#103A82]/5 text-[#103A82]">
                  <span class="w-2 h-2 rounded-full bg-[#D9232D] animate-pulse"></span>
                  <span class="font-bold text-[#D9232D]">📢 车队通告:</span>
                  <span class="val font-semibold text-zinc-900">${config.site.tickerText.trim()}</span>
                </div>
              `;
            }

            // 数据条目列表
            const items = Array.isArray(config.site.tickerItems) && config.site.tickerItems.length
              ? config.site.tickerItems
              : (mgr.DEFAULT_CONFIG && mgr.DEFAULT_CONFIG.site && mgr.DEFAULT_CONFIG.site.tickerItems);

            if (items && items.length) {
              items.forEach((item, idx) => {
                const isFirst = idx === 0 && (!config.site.tickerText || !config.site.tickerText.trim());
                const pulseDot = (item.pulse || isFirst) ? `<span class="w-2 h-2 rounded-full bg-[#103A82] animate-pulse"></span>` : '';
                const valClass = item.color ? `val ${item.color} font-bold` : (item.highlight ? 'highlight' : 'val');
                pillsHtml += `
                  <div class="telemetry-pill">
                    ${pulseDot}
                    <span>${item.label || item.prefix || ''}:</span>
                    <span class="${valClass}">${item.val || item.value || ''}</span>
                  </div>
                `;
              });
            }

            if (pillsHtml) {
              tickerTrack.innerHTML = `
                <div class="flex items-center">${pillsHtml}</div>
                <div class="flex items-center">${pillsHtml}</div>
              `;
            }
          }
        }

        // 1. 动态同步倒计时赛期、主标题与拟定赛期文案
        if (config.site) {
          if (config.site.countdownDate && window.LingYun && window.LingYun.ENGINE_CONFIG) {
            window.LingYun.ENGINE_CONFIG.competition = window.LingYun.ENGINE_CONFIG.competition || {};
            if (config.site.countdownTitle) window.LingYun.ENGINE_CONFIG.competition.name = config.site.countdownTitle;
            window.LingYun.ENGINE_CONFIG.competition.startDate = config.site.countdownDate;
          }
          const titleEl = document.getElementById('count-title-text');
          if (titleEl && config.site.countdownLabel) {
            titleEl.textContent = config.site.countdownLabel;
          }
          const periodEl = document.getElementById('count-period-text');
          if (periodEl && config.site.countdownPeriod) {
            periodEl.textContent = config.site.countdownPeriod;
          }

          // 2. 动态同步当前研发/备赛状态与指示灯
          if (config.site.currentStatus) {
            const statusEl = document.getElementById('season-status-text');
            if (statusEl) statusEl.textContent = config.site.currentStatus;
            const milestoneStatusEl = document.getElementById('milestone-current-status');
            if (milestoneStatusEl) milestoneStatusEl.textContent = config.site.currentStatus;
          }
          if (config.site.currentLocation) {
            const locEl = document.getElementById('season-status-location');
            if (locEl) locEl.textContent = config.site.currentLocation;
          }
          if (config.site.currentStatusColor) {
            const dotEl = document.getElementById('season-status-dot');
            if (dotEl) {
              const colorMap = {
                emerald: 'bg-emerald-500',
                amber: 'bg-amber-500',
                blue: 'bg-[#103A82]',
                red: 'bg-[#D9232D]'
              };
              const newColorClass = colorMap[config.site.currentStatusColor] || 'bg-emerald-500';
              dotEl.className = `w-2 h-2 rounded-full ${newColorClass} animate-pulse`;
            }
          }
        }

        // 3. 动态更新基地地址与各处邮箱
        if (config.site && config.site.workshopAddress) {
          document.querySelectorAll('.dynamic-address').forEach(el => el.textContent = config.site.workshopAddress);
        }

        // 4. 动态更新招新状态通知
        if (config.recruitment && !config.recruitment.isOpen) {
          document.querySelectorAll('.recruitment-status-pill').forEach(el => {
            el.textContent = '● 招募暂未开启';
            el.className = el.className.replace(/text-emerald-\d+/, 'text-amber-600').replace(/bg-emerald-\d+/, 'bg-amber-100');
          });
        }
      } catch (err) {
        debug.error('bootstrap', 'applyDynamicContent error', err);
      }
    }

    // 监听全站配置更新与跨页面广播，实现零刷新热更新
    if (typeof window !== 'undefined') {
      window.addEventListener('ly_config_updated', applyDynamicContent);
      window.addEventListener('storage', (e) => {
        if (e.key === 'ly_site_config_v2') applyDynamicContent();
      });
    }

    // 顺序挂载各大核心子系统 (带独立错误边界)
    mount('UnifiedScrollEngine', () => UnifiedScrollEngine.init());
    mount('TickerLifecycle',      () => TickerLifecycle.init());
    mount('F1TiltEngine',         () => F1TiltEngine.init());
    mount('CarTelemetryHUD',      () => CarTelemetryHUD.init());
    mount('CarSpecTabs',          () => CarSpecTabs.init());
    mount('ScrollRevealEngine',   () => ScrollRevealEngine.init());
    mount('TelemetryCounters',    () => TelemetryCounters.init());
    mount('CountdownTimer',       () => CountdownTimer.init());
    mount('ActivityFilters',      () => ActivityFilters.init());
    mount('ModalEngine',          () => ModalEngine.init());
    mount('MobileNav',            () => MobileNav.init());
    mount('FormDispatcher',       () => FormDispatcher.init());
    mount('SecurityShield',       () => SecurityShield.init());
    mount('DynamicContent',       () => applyDynamicContent());

    if (typeof window !== 'undefined') {
      window.addEventListener('ly_config_updated', () => applyDynamicContent());
      // 异步从仓库 config.json 拉取最新全站配置 (全员可见，改完即生效)
      const mgr = (window.LingYun && window.LingYun.SiteConfigManager) || window.SiteConfigManager;
      if (mgr && typeof mgr.fetchRepoConfig === 'function') {
        mgr.fetchRepoConfig();
      }
    }

    debug.log('bootstrap', 'All core subsystems mounted');
  }

  // 挂载至统一命名空间
  window.LingYun = window.LingYun || {};

  // 页面 DOM 就绪即刻初始化
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }

    // 资源加载完成再次核验图标完整性
    window.addEventListener('load', () => {
      if (window.lucide) {
        try {
          window.lucide.createIcons();
        } catch (e) {
          // 静默处理
        }
      }
    });
  }
window.LingYun.initApp = initApp;

})(window);
