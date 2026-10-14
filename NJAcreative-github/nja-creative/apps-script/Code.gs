/**
 * NJAcreative Backend – Google Apps Script
 * -----------------------------------------
 * Database: Google Sheets (auto-created)
 * Config & password: Script Properties (tidak pernah di GitHub Pages)
 *
 * SETUP:
 * 1. Buka script.google.com → New project
 * 2. Paste seluruh kode ini
 * 3. Jalankan fungsi setup() sekali (Authorize)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL Web App → tempel di frontend (CONFIG.API_URL)
 */

const PROP = PropertiesService.getScriptProperties();

// ===================== SETUP (jalankan sekali) =====================
function setup() {
  // 1. Password admin (default)
  if (!PROP.getProperty('ADMIN_PASSWORD')) {
    PROP.setProperty('ADMIN_PASSWORD', 'Bismillaah');
  }

  // 2. Buat / ambil Spreadsheet
  let ssId = PROP.getProperty('SPREADSHEET_ID');
  let ss;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create('NJAcreative Database');
    PROP.setProperty('SPREADSHEET_ID', ss.getId());
  }

  // 3. Generate sheets + headers
  ensureSheet_(ss, 'Products', [
    'id', 'name', 'description', 'price', 'image_url',
    'tag', 'active', 'sort_order', 'created_at', 'updated_at'
  ]);

  ensureSheet_(ss, 'Settings', [
    'key', 'value', 'updated_at'
  ]);

  ensureSheet_(ss, 'Orders', [
    'id', 'product_id', 'product_name', 'buyer_name',
    'buyer_contact', 'note', 'status', 'created_at'
  ]);

  // 4. Seed data default (hanya jika Products masih kosong)
  const productsSheet = ss.getSheetByName('Products');
  if (productsSheet.getLastRow() <= 1) {
    const now = new Date().toISOString();
    const seed = [
      ['p1', 'Little Thing #01', 'A tiny creative piece made with love ♡', 25000, 'images/store-1.jpg', 'new ✦', 'TRUE', 1, now, now],
      ['p2', 'Little Thing #02', 'Something cute from my little creative world ♡', 35000, 'images/store-2.jpg', '', 'TRUE', 2, now, now],
      ['p3', 'Little Thing #03', 'Made for anyone who loves little things ♡', 45000, 'images/store-3.jpg', '', 'TRUE', 3, now, now]
    ];
    productsSheet.getRange(2, 1, seed.length, seed[0].length).setValues(seed);
  }

  // 5. Seed Settings
  const settingsSheet = ss.getSheetByName('Settings');
  if (settingsSheet.getLastRow() <= 1) {
    const now = new Date().toISOString();
    settingsSheet.appendRow(['site_title', 'NJAcreative ✦ My Creative Journey', now]);
    settingsSheet.appendRow(['instagram', 'https://instagram.com/kknjau', now]);
    settingsSheet.appendRow(['qris_image', 'qris.jpg', now]);
  }

  Logger.log('✅ Setup selesai!');
  Logger.log('Spreadsheet ID: ' + ss.getId());
  Logger.log('URL Spreadsheet: https://docs.google.com/spreadsheets/d/' + ss.getId());
  Logger.log('Password admin saat ini: ' + PROP.getProperty('ADMIN_PASSWORD'));
}

/**
 * Helper: pastikan sheet ada + header benar
 */
function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  // Set header jika kosong / berbeda
  const currentHeader = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = currentHeader.join('') === '' || currentHeader[0] !== headers[0];
  if (needsHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ===================== WEB APP ENTRY =====================
function doGet(e) {
  return handleRequest_(e, 'GET');
}

function doPost(e) {
  return handleRequest_(e, 'POST');
}

function handleRequest_(e, method) {
  try {
    const action = (e.parameter && e.parameter.action) || (e.postData && JSON.parse(e.postData.contents).action) || '';
    let body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (_) {}
    }

    // CORS helper
    const output = (data, code = 200) => {
      return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    };

    // ---- PUBLIC ----
    if (action === 'getProducts') {
      return output({ success: true, data: getProducts_() });
    }

    if (action === 'getSettings') {
      return output({ success: true, data: getSettings_() });
    }

    // ---- AUTH ----
    if (action === 'login') {
      const password = body.password || '';
      const stored = PROP.getProperty('ADMIN_PASSWORD') || 'Bismillaah';
      if (password === stored) {
        const token = Utilities.getUuid();
        const expires = Date.now() + (6 * 60 * 60 * 1000); // 6 jam
        PROP.setProperty('SESSION_TOKEN', token);
        PROP.setProperty('SESSION_EXPIRES', String(expires));
        return output({ success: true, token: token, expires: expires });
      }
      return output({ success: false, message: 'Password salah' }, 401);
    }

    if (action === 'checkAuth') {
      const token = body.token || e.parameter.token || '';
      if (isValidToken_(token)) {
        return output({ success: true, authenticated: true });
      }
      return output({ success: true, authenticated: false });
    }

    // ---- ADMIN (butuh token) ----
    const token = body.token || e.parameter.token || '';
    if (!isValidToken_(token)) {
      return output({ success: false, message: 'Unauthorized' }, 401);
    }

    // CRUD Products
    if (action === 'createProduct') {
      return output(createProduct_(body));
    }
    if (action === 'updateProduct') {
      return output(updateProduct_(body));
    }
    if (action === 'deleteProduct') {
      return output(deleteProduct_(body.id));
    }
    if (action === 'listAllProducts') {
      return output({ success: true, data: getAllProducts_() });
    }

    // Settings
    if (action === 'updateSetting') {
      return output(updateSetting_(body.key, body.value));
    }

    // Change password
    if (action === 'changePassword') {
      const newPass = (body.newPassword || '').trim();
      if (newPass.length < 6) {
        return output({ success: false, message: 'Password minimal 6 karakter' });
      }
      PROP.setProperty('ADMIN_PASSWORD', newPass);
      return output({ success: true, message: 'Password berhasil diganti' });
    }

    // Orders (opsional)
    if (action === 'createOrder') {
      return output(createOrder_(body));
    }
    if (action === 'listOrders') {
      return output({ success: true, data: getOrders_() });
    }
    if (action === 'updateOrderStatus') {
      return output(updateOrderStatus_(body.id, body.status));
    }

    return output({ success: false, message: 'Unknown action: ' + action });
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===================== AUTH HELPER =====================
function isValidToken_(token) {
  if (!token) return false;
  const stored = PROP.getProperty('SESSION_TOKEN');
  const expires = Number(PROP.getProperty('SESSION_EXPIRES') || 0);
  return stored && stored === token && Date.now() < expires;
}

// ===================== PRODUCTS =====================
function getSheet_(name) {
  const ssId = PROP.getProperty('SPREADSHEET_ID');
  if (!ssId) throw new Error('Spreadsheet belum di-setup. Jalankan setup() dulu.');
  return SpreadsheetApp.openById(ssId).getSheetByName(name);
}

function getProducts_() {
  // Hanya yang active = TRUE, diurutkan sort_order
  const all = getAllProducts_();
  return all
    .filter(p => p.active === true || p.active === 'TRUE' || p.active === 'true')
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
}

function getAllProducts_() {
  const sheet = getSheet_('Products');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    // normalize
    obj.active = obj.active === true || obj.active === 'TRUE' || obj.active === 'true';
    obj.price = Number(obj.price) || 0;
    obj.sort_order = Number(obj.sort_order) || 0;
    return obj;
  });
}

function createProduct_(body) {
  const sheet = getSheet_('Products');
  const id = 'p' + Utilities.getUuid().substring(0, 8);
  const now = new Date().toISOString();
  const row = [
    id,
    body.name || '',
    body.description || '',
    Number(body.price) || 0,
    body.image_url || '',
    body.tag || '',
    body.active !== false ? 'TRUE' : 'FALSE',
    Number(body.sort_order) || 99,
    now,
    now
  ];
  sheet.appendRow(row);
  return { success: true, data: { id: id } };
}

function updateProduct_(body) {
  const sheet = getSheet_('Products');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');
  let found = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === body.id) {
      const now = new Date().toISOString();
      // Update field yang dikirim
      if (body.name !== undefined) sheet.getRange(i + 1, headers.indexOf('name') + 1).setValue(body.name);
      if (body.description !== undefined) sheet.getRange(i + 1, headers.indexOf('description') + 1).setValue(body.description);
      if (body.price !== undefined) sheet.getRange(i + 1, headers.indexOf('price') + 1).setValue(Number(body.price));
      if (body.image_url !== undefined) sheet.getRange(i + 1, headers.indexOf('image_url') + 1).setValue(body.image_url);
      if (body.tag !== undefined) sheet.getRange(i + 1, headers.indexOf('tag') + 1).setValue(body.tag);
      if (body.active !== undefined) sheet.getRange(i + 1, headers.indexOf('active') + 1).setValue(body.active ? 'TRUE' : 'FALSE');
      if (body.sort_order !== undefined) sheet.getRange(i + 1, headers.indexOf('sort_order') + 1).setValue(Number(body.sort_order));
      sheet.getRange(i + 1, headers.indexOf('updated_at') + 1).setValue(now);
      found = true;
      break;
    }
  }
  return found ? { success: true } : { success: false, message: 'Product not found' };
}

function deleteProduct_(id) {
  const sheet = getSheet_('Products');
  const data = sheet.getDataRange().getValues();
  const idCol = data[0].indexOf('id');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Product not found' };
}

// ===================== SETTINGS =====================
function getSettings_() {
  const sheet = getSheet_('Settings');
  const data = sheet.getDataRange().getValues();
  const result = {};
  for (let i = 1; i < data.length; i++) {
    result[data[i][0]] = data[i][1];
  }
  return result;
}

function updateSetting_(key, value) {
  const sheet = getSheet_('Settings');
  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      sheet.getRange(i + 1, 3).setValue(now);
      return { success: true };
    }
  }
  // insert baru
  sheet.appendRow([key, value, now]);
  return { success: true };
}

// ===================== ORDERS (opsional, untuk nanti) =====================
function createOrder_(body) {
  const sheet = getSheet_('Orders');
  const id = 'o' + Utilities.getUuid().substring(0, 8);
  const now = new Date().toISOString();
  sheet.appendRow([
    id,
    body.product_id || '',
    body.product_name || '',
    body.buyer_name || '',
    body.buyer_contact || '',
    body.note || '',
    'pending',
    now
  ]);
  return { success: true, data: { id: id } };
}

function getOrders_() {
  const sheet = getSheet_('Orders');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  }).reverse(); // terbaru di atas
}

function updateOrderStatus_(id, status) {
  const sheet = getSheet_('Orders');
  const data = sheet.getDataRange().getValues();
  const idCol = data[0].indexOf('id');
  const statusCol = data[0].indexOf('status');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.getRange(i + 1, statusCol + 1).setValue(status);
      return { success: true };
    }
  }
  return { success: false, message: 'Order not found' };
}

// ===================== UTILITY: ganti password dari editor =====================
function setAdminPassword(newPassword) {
  PROP.setProperty('ADMIN_PASSWORD', newPassword);
  Logger.log('Password admin diubah.');
}
