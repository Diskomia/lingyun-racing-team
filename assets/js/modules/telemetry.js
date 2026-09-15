/**
 * =========================================================================
 * 🏎️ LINGYUN OIL RACING TEAM - 2026 49号 模块化架构
 * Module: 04 - CarTelemetryHUD (2026 赛季 49号 赛车工程子系统热点拆解引擎)
 * =========================================================================
 */

'use strict';

(function(global) {
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

  // 挂载至统一命名空间
  global.LingYun = global.LingYun || {};
  global.LingYun.CarTelemetryHUD = CarTelemetryHUD;

  // 向后兼容全局作用域
  global.CarTelemetryHUD = CarTelemetryHUD;
})(typeof window !== 'undefined' ? window : this);
