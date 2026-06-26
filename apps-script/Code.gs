/**
 * ShinyLogic - Contact form backend (Google Apps Script, container-bound to a Google Sheet).
 *
 * Appends every consultation to the sheet AND emails a notification to NOTIFY_EMAIL.
 * Deploy: in your Google Sheet -> Extensions -> Apps Script, paste this file, then
 *   Deploy -> New deployment -> Web app -> Execute as: Me -> Who has access: Anyone
 *   -> copy the /exec URL into src/pages/contact.html <form data-endpoint="...">.
 * See apps-script/SETUP.md for the full walkthrough.
 */

var NOTIFY_EMAIL = 'roberto.hsu@gmail.com'; // <-- CHANGE THIS to your inbox (see SETUP.md step 3)
var SHEET_NAME = 'Inquiries';
var HEADERS = ['Timestamp', 'Name', 'Company', 'Email', 'Inquiry Type', 'Message', 'Locale', 'User Agent'];

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Honeypot: real users never see the "botcheck" field; bots that fill it are dropped
    // (return success so the bot gets no signal).
    if (p.botcheck) {
      return _json({ ok: true });
    }

    // Minimal server-side validation (mirrors the required client fields).
    if (!p.name || !p.email || !p.message || !p.inquiry_type) {
      return _json({ ok: false, error: 'missing required fields' });
    }

    var sheet = _sheet();
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.company || '',
      p.email || '',
      p.inquiry_type || '',
      p.message || '',
      p.locale || '',
      p.userAgent || '',
    ]);

    _notify(p);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

// Health check: open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return _json({ ok: true, service: 'shinylogic-contact', sheet: SHEET_NAME });
}

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _notify(p) {
  var subject = '[ShinyLogic Inquiry] ' + (p.inquiry_type || '') + ' - ' + (p.name || '(no name)');
  var lines = [
    'Name 姓名: ' + (p.name || ''),
    'Company 公司: ' + (p.company || ''),
    'Email: ' + (p.email || ''),
    'Type 諮詢類型: ' + (p.inquiry_type || ''),
    'Locale 語言: ' + (p.locale || ''),
    '',
    'Message 訊息:',
    p.message || '',
    '',
    '-- sent automatically by the website contact form',
  ];
  var options = { name: 'ShinyLogic Website' };
  // Replies go straight to the inquirer when the address looks valid.
  if (p.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) {
    options.replyTo = p.email;
  }
  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'), options);
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
