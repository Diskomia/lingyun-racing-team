/**
 * =========================================================================
 * 🏎️ 河北工程大学科信学院凌云油车队 · GAS 邮件与回执分发中枢
 * =========================================================================
 * 部署：Ctrl+S 保存 → Deploy → Manage deployments → 铅笔 → New version → Deploy
 */

function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : '';
    var data = {};
    if (rawData) {
      try { data = JSON.parse(rawData); } catch (err) { data = e.parameter || {}; }
    } else { data = e.parameter || {}; }

    if (data.action === 'save_config') {
      var configStr = typeof data.config === 'string' ? data.config : JSON.stringify(data.config);
      PropertiesService.getScriptProperties().setProperty('LY_SITE_CONFIG', configStr);
      return ContentService.createTextOutput(JSON.stringify({success:true,message:"配置已保存"})).setMimeType(ContentService.MimeType.JSON);
    }

    var targetAdminEmail = "diskomiakhan@gmail.com";
    var recipientEmail = data._targetEmail || targetAdminEmail;
    var ccEmail = (data._ccEmail && data._ccEmail !== recipientEmail) ? data._ccEmail : "";
    var subject = data._subject || "【凌云油车队】官方网站新表单提交通知";
    var submitterEmail = data.email || data['申请人电子邮箱'] || data['企业对接邮箱'] || data['来访人联络邮箱'] || "";
    var submitterName = data['申请人/单位'] || data['申请人姓名'] || data['来访人姓名/称呼'] || data['企业/机构全称'] || data.name || "申报人";
    var receiptId = data['受理编号'] || ("LY2026-" + Utilities.formatDate(new Date(), "GMT+8", "yyyyMMdd-HHmmss"));
    var autoResponse = data._autoresponse || "";
    var timestamp = data['提交时间'] || Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss 'CST'");
    var targetRole = data['申报意向/合作级别'] || data['申请意向组别'] || data['意向合作级别'] || data['咨询交流类型'] || "凌云油车队申请";

    var siteUrl = "https://diskomia.github.io/lingyun-racing-team/";
    var IMG_BASE = "https://raw.githubusercontent.com/Diskomia/lingyun-racing-team/main/assets/images/";

    function embedImage(url) {
      try {
        var resp = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
        if (resp.getResponseCode() === 200) {
          var blob = resp.getBlob();
          return "data:" + blob.getContentType() + ";base64," + Utilities.base64Encode(blob.getBytes());
        }
      } catch (_) {}
      return url;
    }

    function getDeptIcon(role) {
      if (role.indexOf("动力") >= 0 || role.indexOf("powertrain") >= 0) return IMG_BASE + "icon_powertrain.png";
      if (role.indexOf("底盘") >= 0 || role.indexOf("chassis") >= 0) return IMG_BASE + "icon_chassis.png";
      if (role.indexOf("车身") >= 0 || role.indexOf("body") >= 0) return IMG_BASE + "icon_body.png";
      if (role.indexOf("商业") >= 0 || role.indexOf("business") >= 0) return IMG_BASE + "icon_business.png";
      return IMG_BASE + "logo.png";
    }

    var logoUrl = embedImage(IMG_BASE + "logo.png");
    var deptIconUrl = embedImage(getDeptIcon(targetRole));

    // ===== 管理员邮件 =====
    var adminHtml = '<div style="background:#f1f5f9;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      '<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.06);">' +
        '<div style="background:#0c1017;padding:18px 24px;border-bottom:2px solid #D9232D;">' +
          '<table style="width:100%;border-collapse:collapse;"><tr>' +
            '<td style="width:40px;vertical-align:middle;"><img src="' + logoUrl + '" style="width:34px;height:34px;display:block;"></td>' +
            '<td style="vertical-align:middle;padding-left:12px;">' +
              '<div style="color:#fff;font-size:15px;font-weight:700;">河北工程大学科信学院 · 凌云油车队</div>' +
              '<div style="color:#94a3b8;font-size:10px;letter-spacing:1px;text-transform:uppercase;">VERIFIED INTAKE TELEMETRY</div>' +
            '</td>' +
            '<td style="text-align:right;vertical-align:middle;"><span style="background:#103A82;color:#fff;font-size:10px;font-weight:bold;padding:4px 10px;border-radius:4px;">新填报</span></td>' +
          '</tr></table>' +
        '</div>' +
        '<div style="padding:24px;">' +
          '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:12.5px;color:#334155;line-height:1.6;">' +
            '<strong>官方受理编号：</strong><code style="color:#103a82;font-weight:bold;">' + receiptId + '</code><br>' +
            '<strong>提交登记时间：</strong>' + timestamp + '<br>' +
            '<strong>申请人预留邮箱：</strong><a href="mailto:' + submitterEmail + '" style="color:#103a82;font-weight:600;">' + submitterEmail + '</a>' +
          '</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#1e293b;margin-bottom:20px;">';

    for (var key in data) {
      if (!key.startsWith('_') && key !== 'email' && key !== '受理编号') {
        adminHtml += '<tr style="border-bottom:1px solid #f1f5f9;">' +
          '<td style="padding:10px 12px;font-weight:600;width:34%;background:#f8fafc;color:#475569;">' + key + '</td>' +
          '<td style="padding:10px 12px;color:#0f172a;white-space:pre-wrap;">' + data[key] + '</td>' +
        '</tr>';
      }
    }
    adminHtml += '</table></div>' +
      '<div style="border-top:1px solid #e2e8f0;padding:14px 20px;font-size:11px;color:#94a3b8;text-align:center;background:#f8fafc;">河北工程大学科信学院凌云油车队管理中枢自动投递</div>' +
    '</div></div>';

    try {
      MailApp.sendEmail({to: recipientEmail, replyTo: submitterEmail, name: "河北工程大学科信学院凌云油车队", subject: subject, htmlBody: adminHtml, cc: ccEmail});
    } catch(e) {}

    // ===== 申请人回执邮件 =====
    if (submitterEmail && autoResponse) {
      var applicantSubject = "【河北工程大学科信学院凌云油车队】您的申报已受理 (受理号: " + receiptId + ")";

      var applicantHtml = (
        '<div style="background:#f1f5f9;padding:16px 8px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">' +
        '<div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.06);">' +
          '<div style="background:#0c1017;padding:16px 20px;border-bottom:2px solid #D9232D;">' +
            '<table style="width:100%;border-collapse:collapse;"><tr>' +
              '<td style="width:40px;vertical-align:middle;"><img src="' + logoUrl + '" style="width:32px;height:32px;display:block;"></td>' +
              '<td style="vertical-align:middle;padding-left:10px;">' +
                '<div style="color:#fff;font-size:14px;font-weight:700;">河北工程大学科信学院 · 凌云油车队</div>' +
                '<div style="color:#94a3b8;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;">OFFICIAL ADMISSIONS & TELEMETRY HUB</div>' +
              '</td>' +
              '<td style="text-align:right;vertical-align:middle;"><span style="background:#D9232D;color:#fff;font-size:9.5px;font-weight:bold;padding:3px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px;">OFFICIAL</span></td>' +
            '</tr></table>' +
          '</div>' +
          '<div style="padding:24px 16px;">' +
            '<div style="text-align:center;margin-bottom:20px;">' +
              '<div style="display:inline-block;width:68px;height:68px;padding:8px;background:#fff;border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 4px 12px rgba(0,0,0,.05);margin-bottom:12px;">' +
                '<img src="' + deptIconUrl + '" alt="' + targetRole + '" style="width:100%;height:100%;object-fit:contain;display:block;">' +
              '</div>' +
              '<h1 style="color:#0f172a;font-size:20px;font-weight:700;margin:0 0 6px;letter-spacing:-.3px;line-height:1.3;">表单正式受理与初审确认回执</h1>' +
              '<div style="color:#64748b;font-size:11px;font-family:monospace;margin-bottom:12px;letter-spacing:.3px;">LINGYUN OIL RACING TEAM · VERIFIED ADMISSION CERTIFICATE</div>' +
              '<div style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:9999px;padding:4px 12px;font-size:11.5px;color:#334155;">' +
                '<span style="color:#10b981;font-weight:bold;margin-right:5px;">●</span>' +
                '<span style="font-family:monospace;font-weight:500;">' + submitterEmail + '</span>' +
                '<span style="color:#cbd5e1;margin:0 6px;">|</span>' +
                '<span style="color:#059669;font-weight:600;">已正式受理</span>' +
              '</div>' +
            '</div>' +
            '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0 20px;">' +
            '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:20px;font-size:12.5px;line-height:1.6;">' +
              '<table style="width:100%;border-collapse:collapse;">' +
                '<tr><td style="padding:5px 0;color:#64748b;font-size:12px;white-space:nowrap;width:95px;">官方受理编号：</td><td style="padding:5px 0 5px 6px;font-weight:700;color:#103a82;font-family:monospace;font-size:12px;text-align:right;word-break:break-all;">' + receiptId + '</td></tr>' +
                '<tr><td style="padding:5px 0;color:#64748b;font-size:12px;white-space:nowrap;width:95px;">申报人 / 单位：</td><td style="padding:5px 0 5px 6px;font-weight:600;color:#0f172a;font-size:12px;text-align:right;">' + submitterName + '</td></tr>' +
                '<tr><td style="padding:5px 0;color:#64748b;font-size:12px;white-space:nowrap;width:95px;">申报意向组别：</td><td style="padding:5px 0 5px 6px;font-weight:700;color:#D9232D;font-size:12px;text-align:right;">' + targetRole + '</td></tr>' +
                '<tr><td style="padding:5px 0;color:#64748b;font-size:12px;white-space:nowrap;width:95px;">受理登记时间：</td><td style="padding:5px 0 5px 6px;color:#475569;font-family:monospace;font-size:11px;text-align:right;">' + timestamp + '</td></tr>' +
                '<tr><td style="padding:5px 0;color:#64748b;font-size:12px;white-space:nowrap;width:95px;">官方统筹邮箱：</td><td style="padding:5px 0 5px 6px;color:#103a82;font-family:monospace;font-size:11px;text-align:right;"><a href="mailto:' + targetAdminEmail + '" style="color:#103a82;text-decoration:none;">' + targetAdminEmail + '</a></td></tr>' +
              '</table>' +
            '</div>' +
            '<div style="margin-bottom:8px;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><tr>' +
              '<td style="font-weight:600;color:#334155;">✉️ 车队评审组初审信函全文：</td>' +
              '<td style="text-align:right;color:#94a3b8;font-size:11px;">官方正式签发</td>' +
            '</tr></table></div>' +
            '<div style="border-left:4px solid #D9232D;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 10px 10px 0;padding:18px 20px;font-size:13.5px;line-height:1.8;color:#1e293b;white-space:pre-wrap;margin-bottom:24px;">' + autoResponse + '</div>' +
            '<div style="text-align:center;margin-bottom:24px;"><a href="' + siteUrl + '" style="display:inline-block;background:#103A82;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:600;letter-spacing:.3px;box-shadow:0 4px 12px rgba(16,58,130,.2);">访问凌云油车队官方网站 ➔</a></div>' +
            '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:12px 16px;font-size:11.5px;color:#1e40af;line-height:1.6;">ℹ️ <strong>官方回执通知：</strong>本回执由河北工程大学科信学院凌云油车队评审组系统自动签发。车队将在 3 个工作日内向此邮箱外发初审评估结果或线下车间面试通知，请保持通讯畅通。</div>' +
          '</div>' +
          '<div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 24px;text-align:center;font-size:11px;color:#64748b;line-height:1.6;">' +
            '<div style="font-weight:600;color:#334155;margin-bottom:4px;">河北工程大学科信学院凌云油车队 (Lingyun Oil Racing Team)</div>' +
            '车间基地：河北省邯郸市光明南大街199号河北工程大学科信学院成学楼东侧机械装备与制造学院<br>' +
            '官方联络邮箱：<a href="mailto:' + targetAdminEmail + '" style="color:#103a82;text-decoration:none;">' + targetAdminEmail + '</a>' +
          '</div>' +
        '</div></div>'
      );

      try {
        MailApp.sendEmail({
          to: submitterEmail,
          replyTo: targetAdminEmail,
          name: "河北工程大学科信学院凌云油车队",
          subject: applicantSubject,
          body: autoResponse,
          htmlBody: applicantHtml,
          bcc: targetAdminEmail
        });
      } catch(e) {}
    }

    return ContentService.createTextOutput(JSON.stringify({success:true, message:"OK", receiptId:receiptId})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success:false, error:error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";
  if (action === "get_config") {
    var rawConfig = PropertiesService.getScriptProperties().getProperty('LY_SITE_CONFIG');
    var cfg = null;
    if (rawConfig) { try { cfg = JSON.parse(rawConfig); } catch(_){} }
    return ContentService.createTextOutput(JSON.stringify({success:true, config:cfg})).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({status:"online", service:"Lingyun Oil Racing Team Mailer", time:new Date().toISOString()})).setMimeType(ContentService.MimeType.JSON);
}
