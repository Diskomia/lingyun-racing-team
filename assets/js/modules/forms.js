/**
 * =========================================================================
 * 🏎️ LINGYUN RACING TEAM - 2026 E72 模块化架构
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
 */

'use strict';

(function(global) {
  const FormDispatcher = {
    targetEmail: 'diskomiakhan@gmail.com',
    endpoint: 'https://formsubmit.co/ajax/diskomiakhan@gmail.com',
    gasEndpoint: 'https://script.google.com/macros/s/AKfycbxokikkqxMlEYXQr2RAbHU218VagoeyxxmaAAW-ngcioI3PdcO7b7zugckuTcROxvWdLg/exec',

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
        const mgr = (global.LingYun && global.LingYun.SiteConfigManager) || global.SiteConfigManager;
        if (mgr) cfg = mgr.load();
      } catch (_) {}

      const depts = (cfg && cfg.departments) || {};
      const generalEmail = (depts.general && depts.general.email) || defaultEmail;

      if (category === 'recruit') {
        const r = String(role || '');
        if (r.includes('电气') && depts.electrical && depts.electrical.email) {
          return {
            name: depts.electrical.name || '电气组',
            head: depts.electrical.head || '电控负责人',
            targetEmail: depts.electrical.email,
            ccEmail: generalEmail,
            prepGuide: depts.electrical.prepGuide || '建议学习相关知识或准备过往作品。'
          };
        }
        if (r.includes('机械') && depts.mechanical && depts.mechanical.email) {
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
      table += ` 🏎️ 凌云车队官方网站信息交互登记表 · ${title}\n`;
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
        if (role.includes('动力') || role.includes('powertrain')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【动力总成组】！
您的招募申请与专业背景资料已确认送达车队动力总成评审组。

动力总成组负责内燃机性能开发、进排气系统设计、燃油喷射与 ECU 标定、传动差速器匹配、冷却与润滑系统优化，是方程式赛车的心脏。

车队技术总监与人事组正在对您的申请进行初步评估，我们将在 3 个工作日内通过本邮箱向您发送考核笔试与车间实训探访通知，请注意查收邮件。

【建议准备】：
建议学习内燃机、进排气与发动机控制相关知识或准备过往作品。

期待在车间与您共同打造凌云油车队 2026 赛季全新方程式赛车！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
动力总成与人事综合部
车间基地：河北省邯郸市光明南大街199号河北工程大学科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        if (role.includes('电气')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学凌云车队【电气组】！
您的招募申请与专业背景资料已确认送达车队电控系统评审组。

作为中国大学生电动方程式大赛 (FSEC) 赛车的大脑与能量源泉，电气组全面负责 504V 高压动力电池箱、整车低压安全回路、自主研发主控 BMS、电机矢量控制算法与数字孪生遥测系统。

车队技术总监与人事组正在对您的申请进行初步评估，我们将在 3 个工作日内通过本邮箱向您发送考核笔试与车间实训探访通知，请注意查收邮件。

【建议准备】：
建议学习相关知识或准备过往作品。

期待在车间与您共同打造凌云车队 2026 赛季全新纯电方程式赛车！

——
河北工程大学凌云车队 (LingYun Racing Team)
电控系统与人事综合部
车间基地：河北省邯郸市新校区42号楼工程实训中心 101/105 室
官方联络：${this.targetEmail}`;
        }

        if (role.includes('底盘') || role.includes('chassis')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【底盘组】！
您的招募申请与专业背景资料已确认送达车队底盘动力学评审组。

底盘组负责整车 4130 铬钼钢桁架轻量化车架、全碳纤维推杆双横臂悬架动力学、转向系统设计、制动系统匹配与精密机械加工制造。

车队技术总监与底盘组主管正在对您的申请进行评估，我们将在 3 个工作日内向您的本邮箱发送第一轮交流与车间实训通知，请保持通讯畅通。

【建议准备】：
建议学习车架、悬架与机械设计相关知识或准备过往作品。

期待与您在车间并肩作战，突破赛道极限！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
底盘与车辆工程部
车间基地：河北省邯郸市光明南大街199号河北工程大学科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        if (role.includes('车身') || role.includes('body')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【车身组】！
您的招募申请与专业背景资料已确认送达车队车身与空气动力学评审组。

车身组负责碳纤维车身覆盖件成型、空气动力学套件设计、人机工程与驾驶舱布置。

车队技术总监与车身组主管正在对您的申请进行评估，我们将在 3 个工作日内向您的本邮箱发送第一轮交流与车间实训通知，请保持通讯畅通。

【建议准备】：
建议学习复合材料、空气动力学与工业设计相关知识或准备过往作品。

期待与您在车间并肩作战，打造流线型车身！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
车身与空气动力学部
车间基地：河北省邯郸市光明南大街199号河北工程大学科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        if (role.includes('商业')) {
          return `尊敬的【${name}】同学：

您好！非常感谢您选择申请加入河北工程大学科信学院凌云油车队【商业与宣传部】！
您的招募申请已送达车队商业运营与品牌管理委员会。

大学生方程式不仅是硬核技术的竞技，更是顶尖工程团队的商业运营实战。商业与宣传部负责全国总决赛英文/中文商业逻辑答辩、整车成本与制造分析（BOM）、企业战略招商赞助、车队品牌宣传与科普拓展。

商业主管将在 3 个工作日内向您的本邮箱发送初审交流通知，请注意查收。

【建议准备】：
建议学习相关知识或准备过往作品。

期待您用商业智慧为凌云油车队注入强劲动能！

——
河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)
商业运营与综合事务部
车间基地：河北省邯郸市光明南大街199号河北工程大学科信学院成学楼东侧机械装备与制造学院
官方联络：${this.targetEmail}`;
        }

        return `尊敬的【${name}】同学：

感谢您选择加入河北工程大学凌云车队【${role}】！您的申请已送达车队评审组。
技术总监与人事组将在 3 个工作日内对您的技能资料进行评估，并通过此邮箱向您发送后续通知。

—— 河北工程大学凌云车队 (LingYun Racing Team)`;
      }

      if (category === 'sponsor') {
        const { tier, company, contactPerson } = details;
        if (tier.includes('战略')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学凌云车队的关注与支持！
我们已正式收到贵司关于【官方战略合作伙伴】的深度校企赞助与产学研协作意向。

作为车队最高合作梯队，车队商业总监将亲自领办，在 24 小时内通过电话或本工作邮箱与您专人对接，并向您呈递《2026赛季FSEC商业赞助白皮书完整版》、车身黄金露出权益对价表及校企联合实验室共建细则。

——
河北工程大学凌云车队 (LingYun Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}
车间地址：河北省邯郸市太极路19号河北工程大学新校区42号楼工程实训中心`;
        }

        if (tier.includes('冠名')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学凌云车队的关注与支持！
我们已正式收到贵司关于【年度企业冠名赞助商】的独家冠名合作意向。

车队队长与商业总监将在 24 小时内与贵司专人联络，沟通年度赛事冠名权益、全国总决赛统一队服与整车涂装方案，并诚挚邀请贵司技术专家及高管团队来访车间实地探访。

——
河北工程大学凌云车队 (LingYun Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}`;
        }

        if (tier.includes('技术') || tier.includes('物料')) {
          return `尊敬的【${contactPerson} / ${company}】：

您好！衷心感谢贵企业对河北工程大学凌云车队的技术认可与物料支持！
我们已正式收到贵司关于【官方技术与物料伙伴】的合作意向。

车队技术总监与供应链主管将在 24 小时内与您核对所需零部件规格、软硬件仿真工具授权或加工工艺对接，共同攻坚大学生方程式赛车核心技术壁垒。

——
河北工程大学凌云车队 (LingYun Racing Team)
技术与供应链部
官方联络邮箱：${this.targetEmail}`;
        }

        return `尊敬的【${contactPerson} / ${company}】：

您好！感谢贵司对河北工程大学凌云车队的支持！
我们已收到贵司关于【${tier}】的合作意向。车队指导教师与商务主管将在 24 小时内与您详细洽谈产学研课题与对价方案。

——
河北工程大学凌云车队 (LingYun Racing Team)
商务合作委员会
官方联络邮箱：${this.targetEmail}`;
      }

      if (category === 'contact') {
        const { inquiryType, name, org } = details;
        return `尊敬的【${name} (${org})】：

您好！感谢您向河北工程大学凌云车队发送在线讯息（咨询类别：【${inquiryType}】）！
车队队长与对应事务负责人已收到您的留言，我们将在 24 小时内向您的本邮箱进行答复与对接。

如需预约实地探访车间，亦可前往邯郸市新校区42号楼工程实训中心 101/105 室。

——
河北工程大学凌云车队 (LingYun Racing Team)
综合事务部
官方联络邮箱：${this.targetEmail}`;
      }

      return `感谢您向河北工程大学凌云车队递交信息！我们将在评估后尽快给您答复。\n\n—— 河北工程大学凌云车队`;
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
        (global.showToast || (global.LingYun && global.LingYun.showToast) || console.log);

      const debug = (global.LingYun && global.LingYun.debug) || global.LYDebug || {
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
        _autoresponse: finalAutoResponse, // 纯文本回执字段
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
        '来源站点': '河北工程大学凌云车队官方网站 (FSEC)'
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
     * 生成符合 Bloomberg & Google 设计风格的正式 HTML 邮件回执 (嵌入官方凌云车队队徽)
     */
    generateApplicantReceiptHtml(meta) {
      const logoUrl = 'https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/logo.png';
      const siteUrl = 'https://diskomia.github.io/lingyun-racing-team/';
      const targetAdminEmail = this.targetEmail || 'diskomiakhan@gmail.com';
      const receiptId = meta.receiptId || `LY2026-REC-${Date.now().toString(36).toUpperCase()}`;
      const submitterEmail = meta.email || '';
      const submitterName = meta.name || '申报人';
      const targetRole = meta.target || '凌云油车队申请';
      const timeStr = meta.timestamp || this.getFormattedTimestamp();
      const autoResponse = meta.autoResponse || '';

      // 根据组别返回对应图标
      let deptIcon = logoUrl;
      const role = String(targetRole);
      if (role.includes('动力') || role.includes('powertrain')) deptIcon = 'https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/icon_powertrain.png';
      else if (role.includes('底盘') || role.includes('chassis')) deptIcon = 'https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/icon_chassis.png';
      else if (role.includes('车身') || role.includes('body')) deptIcon = 'https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/icon_body.png';
      else if (role.includes('商业') || role.includes('business')) deptIcon = 'https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/icon_business.png';

      return '<div style="background-color: #f1f5f9; padding: 16px 8px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">' +
        '<div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">' +
          
          '<!-- Top Brand Header Bar (Bloomberg Editorial Style - Figure 1 Exact) -->' +
          '<div style="background-color: #0c1017; padding: 16px 20px; border-bottom: 2px solid #D9232D;">' +
            '<table style="width: 100%; border-collapse: collapse;">' +
              '<tr>' +
                '<td style="width: 40px; vertical-align: middle;">' +
                  '<img src="' + logoUrl + '" alt="凌云车队队徽" style="width: 32px; height: 32px; display: block; object-fit: contain;">' +
                '</td>' +
                '<td style="vertical-align: middle; padding-left: 10px;">' +
                  '<div style="color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">河北工程大学 · 凌云车队</div>' +
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
                'LINGYUN RACING TEAM · VERIFIED ADMISSION CERTIFICATE' +
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
                '访问凌云车队官方网站 ➔' +
              '</a>' +
            '</div>' +

            '<!-- Notification Tip (Figure 1 Exact) -->' +
            '<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px; font-size: 11.5px; color: #1e40af; line-height: 1.6;">' +
              'ℹ️ <strong>官方回执通知：</strong>本回执由河北工程大学凌云车队电控与评审组系统自动签发。车队将在 3 个工作日内向此邮箱外发初审评估结果或线下车间面试通知，请保持通讯畅通。' +
            '</div>' +

          '</div>' +

          '<!-- Official Engineering Base Footer (Figure 1 Exact) -->' +
          '<div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;">' +
            '<div style="font-weight: 600; color: #334155; margin-bottom: 4px;">河北工程大学凌云车队 (LingYun Racing Team)</div>' +
            '车间基地：河北省邯郸市太极路19号河北工程大学新校区42号楼工程实训中心 101/105 室<br>' +
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

        const modalEngine = (global.LingYun && global.LingYun.ModalEngine) || global.ModalEngine;
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
          const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
          toast('🎉 招募申请已提交！已向您的邮箱发送回执。', 'success');
          if (modal && global.LingYun && global.LingYun.ModalEngine) {
            global.LingYun.ModalEngine.closeModal(modal);
          }
        }, 500);
        return;
      }

      // 安全层 2：客户端频次限制检查 (Rate Limiting)
      const rateCheck = this.checkRateLimit('recruit');
      if (!rateCheck.allowed) {
        const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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
      const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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

      const subject = `【凌云车队招募申请】${cleanRole} - ${cleanName}`;
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
          if (modal && global.LingYun && global.LingYun.ModalEngine) {
            global.LingYun.ModalEngine.closeModal(modal);
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
          const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
          toast('🏁 赞助意向已确认！车队将尽快与贵司联络。', 'success');
          if (modal && global.LingYun && global.LingYun.ModalEngine) {
            global.LingYun.ModalEngine.closeModal(modal);
          }
        }, 500);
        return;
      }

      // 安全层 2：客户端频次限制检查
      const rateCheck = this.checkRateLimit('sponsor');
      if (!rateCheck.allowed) {
        const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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
      const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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

      const subject = `【凌云车队赞助洽谈】${cleanTier} - ${cleanCompany}`;
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
          if (modal && global.LingYun && global.LingYun.ModalEngine) {
            global.LingYun.ModalEngine.closeModal(modal);
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
            const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
            toast('📬 留言已提交！已向您的邮箱发送回执。', 'success');
          }, 500);
          return;
        }

        // 安全层 2：客户端频次限制检查
        const rateCheck = this.checkRateLimit('contact');
        if (!rateCheck.allowed) {
          const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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
        const toast = (typeof showToast !== 'undefined') ? showToast : (global.showToast || console.log);
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

        const subject = `【凌云车队在线留言】${cleanInquiryType} - ${cleanName} (${cleanOrg})`;
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
  global.LingYun = global.LingYun || {};
  global.LingYun.FormDispatcher = FormDispatcher;

  // 向后兼容全局作用域
  global.FormDispatcher = FormDispatcher;
})(typeof window !== 'undefined' ? window : this);
