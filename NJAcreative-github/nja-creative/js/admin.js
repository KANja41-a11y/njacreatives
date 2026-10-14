/**
 * NJAcreative Admin Panel
 * Akses: klik logo (brand) 4 kali berturut-turut
 * Password disimpan di Script Properties Apps Script
 */

(function () {
  'use strict';

  let clickCount = 0;
  let clickTimer = null;
  const CLICK_RESET_MS = 1200;

  // ========== LOGO 4x CLICK ==========
  function initLogoClick() {
    const brand = document.querySelector('.brand');
    if (!brand) return;

    brand.style.cursor = 'pointer';
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, CLICK_RESET_MS);

      if (clickCount >= 4) {
        clickCount = 0;
        openAdminGate();
      }
    });
  }

  // ========== ADMIN GATE (login) ==========
  function openAdminGate() {
    // Cek apakah sudah login
    NJA.checkAuth().then(res => {
      if (res.success && res.authenticated) {
        openAdminPanel();
      } else {
        showLoginModal();
      }
    }).catch(() => showLoginModal());
  }

  function showLoginModal() {
    removeExistingAdminUI();

    const backdrop = document.createElement('div');
    backdrop.id = 'adminGate';
    backdrop.className = 'admin-backdrop';
    backdrop.innerHTML = `
      <div class="admin-modal login-modal">
        <button class="admin-close" id="adminGateClose">×</button>
        <div class="admin-sparkle">✦</div>
        <p class="admin-eyebrow">admin access</p>
        <h2>Welcome back</h2>
        <p class="admin-desc">Masukkan password admin untuk mengelola toko & konten.</p>
        <form id="adminLoginForm">
          <input type="password" id="adminPassword" placeholder="Password admin" autocomplete="current-password" required>
          <button type="submit" class="admin-btn primary">Masuk ✦</button>
        </form>
        <p class="admin-error" id="adminLoginError" hidden></p>
        <p class="admin-hint">Password disimpan aman di Apps Script Properties</p>
      </div>
    `;
    document.body.appendChild(backdrop);

    document.getElementById('adminGateClose').onclick = () => backdrop.remove();
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const pass = document.getElementById('adminPassword').value;
      const errEl = document.getElementById('adminLoginError');
      errEl.hidden = true;

      const btn = e.target.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Memeriksa...';

      const res = await NJA.login(pass);
      if (res.success && res.token) {
        NJA.setToken(res.token);
        backdrop.remove();
        openAdminPanel();
      } else {
        errEl.textContent = res.message || 'Password salah';
        errEl.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Masuk ✦';
      }
    });

    setTimeout(() => document.getElementById('adminPassword')?.focus(), 100);
  }

  // ========== ADMIN PANEL ==========
  function openAdminPanel() {
    removeExistingAdminUI();

    const backdrop = document.createElement('div');
    backdrop.id = 'adminPanel';
    backdrop.className = 'admin-backdrop';
    backdrop.innerHTML = `
      <div class="admin-modal panel-modal">
        <button class="admin-close" id="adminPanelClose">×</button>

        <header class="admin-header">
          <div>
            <p class="admin-eyebrow">NJAcreative Admin</p>
            <h2>Dashboard ✦</h2>
          </div>
          <button class="admin-btn ghost" id="adminLogout">Logout</button>
        </header>

        <nav class="admin-tabs">
          <button class="admin-tab active" data-tab="products">🛍️ Produk</button>
          <button class="admin-tab" data-tab="orders">📦 Pesanan</button>
          <button class="admin-tab" data-tab="settings">⚙️ Pengaturan</button>
        </nav>

        <div class="admin-body">
          <!-- PRODUCTS TAB -->
          <div class="admin-tab-content active" id="tab-products">
            <div class="admin-toolbar">
              <h3>Daftar Produk</h3>
              <button class="admin-btn primary" id="btnAddProduct">+ Tambah Produk</button>
            </div>
            <div id="productsTableWrap" class="admin-table-wrap">
              <p class="admin-loading">Memuat data...</p>
            </div>
          </div>

          <!-- ORDERS TAB -->
          <div class="admin-tab-content" id="tab-orders">
            <div class="admin-toolbar">
              <h3>Pesanan</h3>
            </div>
            <div id="ordersTableWrap" class="admin-table-wrap">
              <p class="admin-loading">Memuat data...</p>
            </div>
          </div>

          <!-- SETTINGS TAB -->
          <div class="admin-tab-content" id="tab-settings">
            <div class="admin-toolbar">
              <h3>Pengaturan</h3>
            </div>
            <form id="settingsForm" class="admin-form">
              <label>Judul Situs
                <input type="text" name="site_title" id="set_site_title">
              </label>
              <label>Link Instagram
                <input type="url" name="instagram" id="set_instagram">
              </label>
              <label>URL Gambar QRIS
                <input type="text" name="qris_image" id="set_qris_image">
              </label>
              <button type="submit" class="admin-btn primary">Simpan Pengaturan</button>
            </form>

            <hr class="admin-divider">

            <form id="passwordForm" class="admin-form">
              <h4>Ganti Password Admin</h4>
              <label>Password Baru
                <input type="password" name="newPassword" id="newPassword" minlength="6" required>
              </label>
              <button type="submit" class="admin-btn ghost">Ganti Password</button>
              <p class="admin-hint">Password disimpan di Script Properties, tidak pernah di GitHub.</p>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Close / Logout
    document.getElementById('adminPanelClose').onclick = () => backdrop.remove();
    document.getElementById('adminLogout').onclick = () => {
      NJA.clearToken();
      backdrop.remove();
    };
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    // Tabs
    backdrop.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        backdrop.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        backdrop.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');

        if (tab.dataset.tab === 'products') loadProductsTable();
        if (tab.dataset.tab === 'orders') loadOrdersTable();
        if (tab.dataset.tab === 'settings') loadSettingsForm();
      });
    });

    // Initial load
    loadProductsTable();

    // Add product
    document.getElementById('btnAddProduct').onclick = () => openProductForm();

    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const keys = ['site_title', 'instagram', 'qris_image'];
      for (const key of keys) {
        const val = form[key].value.trim();
        await NJA.updateSetting(key, val);
      }
      alert('Pengaturan tersimpan ✓');
    });

    // Password form
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPass = document.getElementById('newPassword').value;
      const res = await NJA.changePassword(newPass);
      if (res.success) {
        alert('Password berhasil diganti ✓');
        e.target.reset();
      } else {
        alert(res.message || 'Gagal mengganti password');
      }
    });
  }

  function removeExistingAdminUI() {
    document.getElementById('adminGate')?.remove();
    document.getElementById('adminPanel')?.remove();
    document.getElementById('productFormModal')?.remove();
  }

  // ========== PRODUCTS TABLE ==========
  async function loadProductsTable() {
    const wrap = document.getElementById('productsTableWrap');
    if (!wrap) return;
    wrap.innerHTML = '<p class="admin-loading">Memuat data...</p>';

    const res = await NJA.listAllProducts();
    if (!res.success) {
      wrap.innerHTML = `<p class="admin-error">${res.message || 'Gagal memuat'}</p>`;
      return;
    }

    const products = res.data || [];
    if (products.length === 0) {
      wrap.innerHTML = '<p class="admin-empty">Belum ada produk. Klik “+ Tambah Produk”.</p>';
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Tag</th>
            <th>Aktif</th>
            <th>Urutan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

    products.forEach(p => {
      const price = Number(p.price).toLocaleString('id-ID');
      html += `
        <tr data-id="${p.id}">
          <td><img src="${escapeHtml(p.image_url || '')}" alt="" class="admin-thumb" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23eee%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E'"></td>
          <td>
            <strong>${escapeHtml(p.name)}</strong>
            <br><small>${escapeHtml((p.description || '').substring(0, 60))}${p.description && p.description.length > 60 ? '…' : ''}</small>
          </td>
          <td>Rp ${price}</td>
          <td>${escapeHtml(p.tag || '—')}</td>
          <td>${p.active ? '✅' : '❌'}</td>
          <td>${p.sort_order}</td>
          <td class="admin-actions">
            <button class="admin-btn small" data-edit="${p.id}">Edit</button>
            <button class="admin-btn small danger" data-delete="${p.id}">Hapus</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    wrap.innerHTML = html;

    // Bind actions
    wrap.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const prod = products.find(x => x.id === btn.dataset.edit);
        if (prod) openProductForm(prod);
      };
    });
    wrap.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Yakin hapus produk ini?')) return;
        const res = await NJA.deleteProduct(btn.dataset.delete);
        if (res.success) {
          loadProductsTable();
          // refresh store di halaman
          if (window.loadStoreProducts) window.loadStoreProducts();
        } else {
          alert(res.message || 'Gagal menghapus');
        }
      };
    });
  }

  // ========== PRODUCT FORM (Create / Update) ==========
  function openProductForm(product = null) {
    document.getElementById('productFormModal')?.remove();

    const isEdit = !!product;
    const modal = document.createElement('div');
    modal.id = 'productFormModal';
    modal.className = 'admin-backdrop nested';
    modal.innerHTML = `
      <div class="admin-modal form-modal">
        <button class="admin-close" id="productFormClose">×</button>
        <h3>${isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
        <form id="productForm" class="admin-form">
          <label>Nama Produk *
            <input type="text" name="name" required value="${escapeHtml(product?.name || '')}">
          </label>
          <label>Deskripsi
            <textarea name="description" rows="3">${escapeHtml(product?.description || '')}</textarea>
          </label>
          <label>Harga (Rp) *
            <input type="number" name="price" required min="0" step="1000" value="${product?.price || ''}">
          </label>
          <label>URL Gambar
            <input type="text" name="image_url" placeholder="images/store-1.jpg atau https://..." value="${escapeHtml(product?.image_url || '')}">
          </label>
          <label>Tag (contoh: new ✦)
            <input type="text" name="tag" value="${escapeHtml(product?.tag || '')}">
          </label>
          <label>Urutan Tampil
            <input type="number" name="sort_order" value="${product?.sort_order ?? 99}">
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="active" ${product?.active !== false ? 'checked' : ''}>
            Aktif (tampil di toko)
          </label>
          <div class="form-actions">
            <button type="button" class="admin-btn ghost" id="productFormCancel">Batal</button>
            <button type="submit" class="admin-btn primary">${isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('productFormClose').onclick = close;
    document.getElementById('productFormCancel').onclick = close;
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    document.getElementById('productForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        name: fd.get('name').trim(),
        description: fd.get('description').trim(),
        price: Number(fd.get('price')),
        image_url: fd.get('image_url').trim(),
        tag: fd.get('tag').trim(),
        sort_order: Number(fd.get('sort_order')),
        active: fd.get('active') === 'on'
      };

      const btn = e.target.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Menyimpan...';

      let res;
      if (isEdit) {
        data.id = product.id;
        res = await NJA.updateProduct(data);
      } else {
        res = await NJA.createProduct(data);
      }

      if (res.success) {
        close();
        loadProductsTable();
        if (window.loadStoreProducts) window.loadStoreProducts();
      } else {
        alert(res.message || 'Gagal menyimpan');
        btn.disabled = false;
        btn.textContent = isEdit ? 'Simpan Perubahan' : 'Tambah Produk';
      }
    });
  }

  // ========== ORDERS ==========
  async function loadOrdersTable() {
    const wrap = document.getElementById('ordersTableWrap');
    if (!wrap) return;
    wrap.innerHTML = '<p class="admin-loading">Memuat data...</p>';

    const res = await NJA.listOrders();
    if (!res.success) {
      wrap.innerHTML = `<p class="admin-error">${res.message || 'Gagal memuat'}</p>`;
      return;
    }

    const orders = res.data || [];
    if (orders.length === 0) {
      wrap.innerHTML = '<p class="admin-empty">Belum ada pesanan.</p>';
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produk</th>
            <th>Pembeli</th>
            <th>Kontak</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

    orders.forEach(o => {
      const date = o.created_at ? new Date(o.created_at).toLocaleString('id-ID') : '—';
      html += `
        <tr>
          <td><small>${escapeHtml(o.id)}</small></td>
          <td>${escapeHtml(o.product_name || o.product_id || '—')}</td>
          <td>${escapeHtml(o.buyer_name || '—')}</td>
          <td>${escapeHtml(o.buyer_contact || '—')}</td>
          <td>
            <select class="admin-select status-select" data-id="${o.id}">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="paid" ${o.status === 'paid' ? 'selected' : ''}>Paid</option>
              <option value="done" ${o.status === 'done' ? 'selected' : ''}>Done</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td><small>${date}</small></td>
          <td>
            <button class="admin-btn small" data-note="${escapeHtml(o.note || '')}">Note</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.status-select').forEach(sel => {
      sel.onchange = async () => {
        await NJA.updateOrderStatus(sel.dataset.id, sel.value);
      };
    });
    wrap.querySelectorAll('[data-note]').forEach(btn => {
      btn.onclick = () => alert(btn.dataset.note || '(tidak ada catatan)');
    });
  }

  // ========== SETTINGS ==========
  async function loadSettingsForm() {
    const res = await NJA.getSettings();
    if (!res.success) return;
    const s = res.data || {};
    const el = (id) => document.getElementById(id);
    if (el('set_site_title')) el('set_site_title').value = s.site_title || '';
    if (el('set_instagram')) el('set_instagram').value = s.instagram || '';
    if (el('set_qris_image')) el('set_qris_image').value = s.qris_image || '';
  }

  // ========== UTIL ==========
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ========== INIT ==========
  document.addEventListener('DOMContentLoaded', () => {
    initLogoClick();
  });

  // Expose for store refresh
  window.openAdminPanel = openAdminPanel;
})();
