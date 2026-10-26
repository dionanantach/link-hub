/**
 * Link Hub — backend Google Apps Script.
 * Pasang dari Google Sheet: Ekstensi → Apps Script, tempel seluruh isi file ini.
 * Lalu Deploy → Deployment baru → Aplikasi web (Jalankan sebagai: Saya, Akses: Siapa saja).
 */

// GANTI dengan kode rahasia buatanmu sendiri (bebas, minimal 12 karakter).
// Kode ini juga yang diisi di Pengaturan aplikasi Link Hub.
const TOKEN = "ganti-dengan-kode-rahasiamu";

const SHEET_NAME = "Links";
const HEADERS = ["id", "nama", "url", "kategori", "catatan", "ikon"];

function doGet(e) {
  return handle_((e && e.parameter) || {});
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: "Format permintaan tidak valid" });
  }
  return handle_(body);
}

function handle_(p) {
  if (TOKEN === "ganti-dengan-kode-rahasiamu") return out_({ ok: false, error: "TOKEN di Code.gs belum diganti" });
  if (p.token !== TOKEN) return out_({ ok: false, error: "Token salah" });

  const sh = sheet_();
  const action = p.action || "list";

  if (action !== "list") {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (action === "add") addRow_(sh, p.link || {});
      else if (action === "update") updateRow_(sh, p.link || {});
      else if (action === "delete") deleteRow_(sh, p.id);
      else return out_({ ok: false, error: "Aksi tidak dikenal: " + action });
    } catch (err) {
      return out_({ ok: false, error: err.message });
    } finally {
      lock.releaseLock();
    }
  }
  return out_({ ok: true, links: list_(sh) });
}

/**
 * Jalankan sekali dari editor (pilih "setup" → Run) untuk memberi izin akses
 * dan membuat tab "Links". Setelah itu Web App siap dipakai.
 */
function setup() {
  const sh = sheet_();
  Logger.log("Tab '%s' siap, %s link.", SHEET_NAME, list_(sh).length);
}

/* ---------- Sheet helpers ---------- */

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sh.setFrozenRows(1);
  } else {
    // Tambahkan kolom yang belum ada (misalnya kalau Sheet dibuat manual tanpa kolom id/ikon).
    const head = headers_(sh);
    HEADERS.forEach(function (h) {
      if (head.indexOf(h) < 0) sh.getRange(1, sh.getLastColumn() + 1).setValue(h).setFontWeight("bold");
    });
  }
  return sh;
}

function headers_(sh) {
  return sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });
}

function list_(sh) {
  const head = headers_(sh);
  const last = sh.getLastRow();
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, head.length).getValues();
  const idCol = head.indexOf("id");
  const result = [];
  values.forEach(function (row, i) {
    const obj = {};
    HEADERS.forEach(function (h) { obj[h] = head.indexOf(h) >= 0 ? String(row[head.indexOf(h)]).trim() : ""; });
    if (!obj.nama && !obj.url) return; // baris kosong
    // Baris yang diketik langsung di Sheet belum punya id → buatkan.
    if (!obj.id) {
      obj.id = Utilities.getUuid();
      sh.getRange(i + 2, idCol + 1).setValue(obj.id);
    }
    result.push(obj);
  });
  return result;
}

function findRow_(sh, id) {
  if (!id) return -1;
  const head = headers_(sh);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, head.indexOf("id") + 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function rowFor_(head, link, id) {
  return head.map(function (h) {
    if (h === "id") return id;
    return HEADERS.indexOf(h) >= 0 ? clean_(link[h]) : "";
  });
}

function addRow_(sh, link) {
  if (!link.url) throw new Error("URL kosong");
  const head = headers_(sh);
  sh.appendRow(rowFor_(head, link, Utilities.getUuid()));
}

function updateRow_(sh, link) {
  const r = findRow_(sh, link.id);
  if (r < 0) throw new Error("Link tidak ditemukan (mungkin sudah dihapus)");
  const head = headers_(sh);
  const current = sh.getRange(r, 1, 1, head.length).getValues()[0];
  const next = rowFor_(head, link, link.id).map(function (v, i) {
    return HEADERS.indexOf(head[i]) >= 0 ? v : current[i]; // kolom tambahanmu sendiri tidak ditimpa
  });
  sh.getRange(r, 1, 1, head.length).setValues([next]);
}

function deleteRow_(sh, id) {
  const r = findRow_(sh, id);
  if (r < 0) throw new Error("Link tidak ditemukan");
  sh.deleteRow(r);
}

// Bersihkan input & cegah teks yang diawali "=" dibaca Sheet sebagai rumus.
function clean_(v) {
  let s = String(v == null ? "" : v).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
