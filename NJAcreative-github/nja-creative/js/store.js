/**
 * Dynamic Store – load products from Google Sheets via Apps Script
 */

async function loadStoreProducts() {
  const grid = document.querySelector('.store-grid');
  if (!grid) return;

  // Keep a loading state
  grid.innerHTML = `
    <div class="store-loading reveal show" style="grid-column: 1 / -1; text-align:center; padding:40px; color:#827689;">
      Memuat koleksi kecil... ✦
    </div>
  `;

  try {
    const res = await NJA.getProducts();
    if (!res.success || !Array.isArray(res.data)) {
      // Fallback ke data statis jika API belum siap
      renderFallbackStore(grid);
      return;
    }

    const products = res.data;
    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px; color:#827689;">
          Belum ada produk yang ditampilkan ♡
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map((p, i) => {
      const price = Number(p.price).toLocaleString('id-ID');
      const tag = p.tag ? `<span class="store-tag">${escapeHtml(p.tag)}</span>` : '';
      return `
        <article class="store-card reveal show" data-id="${escapeHtml(p.id)}">
          <div class="store-image">
            <img src="${escapeHtml(p.image_url || 'images/store-1.jpg')}" alt="${escapeHtml(p.name)}" loading="lazy"
              onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f0e6f5%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%238b72b8%22 font-size=%2220%22%3E✿%3C/text%3E%3C/svg%3E'">
            ${tag}
          </div>
          <div class="store-info">
            <h3>${escapeHtml(p.name)}</h3>
            <p>${escapeHtml(p.description || '')}</p>
            <div class="store-bottom">
              <strong>Rp ${price}</strong>
              <button class="store-buy" data-product-id="${escapeHtml(p.id)}" data-product-name="${escapeHtml(p.name)}" data-product-price="${p.price}">
                Get it ↗
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind buy buttons → buka modal order / QRIS
    grid.querySelectorAll('.store-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openOrderModal({
          id: btn.dataset.productId,
          name: btn.dataset.productName,
          price: btn.dataset.productPrice
        });
      });
    });

  } catch (err) {
    console.warn('Store load failed, using fallback', err);
    renderFallbackStore(grid);
  }
}

function renderFallbackStore(grid) {
  // Data default sama seperti yang ada di HTML asli
  const fallback = [
    { id: 'p1', name: 'Little Thing #01', description: 'A tiny creative piece made with love ♡', price: 25000, image_url: 'images/store-1.jpg', tag: 'new ✦' },
    { id: 'p2', name: 'Little Thing #02', description: 'Something cute from my little creative world ♡', price: 35000, image_url: 'images/store-2.jpg', tag: '' },
    { id: 'p3', name: 'Little Thing #03', description: 'Made for anyone who loves little things ♡', price: 45000, image_url: 'images/store-3.jpg', tag: '' }
  ];

  grid.innerHTML = fallback.map(p => {
    const price = Number(p.price).toLocaleString('id-ID');
    const tag = p.tag ? `<span class="store-tag">${p.tag}</span>` : '';
    return `
      <article class="store-card reveal show">
        <div class="store-image">
          <img src="${p.image_url}" alt="${p.name}">
          ${tag}
        </div>
        <div class="store-info">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="store-bottom">
            <strong>Rp ${price}</strong>
            <a href="https://instagram.com/kknjau" target="_blank" rel="noopener" class="store-buy">Get it ↗</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ========== ORDER / QRIS MODAL ==========
function openOrderModal(product) {
  document.getElementById('orderModal')?.remove();

  const price = Number(product.price).toLocaleString('id-ID');
  const modal = document.createElement('div');
  modal.id = 'orderModal';
  modal.className = 'hello-backdrop show';
  modal.innerHTML = `
    <div class="hello-popup order-popup">
      <button class="hello-close" id="orderClose">×</button>
      <div class="hello-sparkle">✦</div>
      <p class="hello-small">little order</p>
      <h2>Pesan <em>${escapeHtml(product.name)}</em></h2>
      <p class="hello-description">
        Harga: <strong>Rp ${price}</strong><br>
        Isi data di bawah, lalu scan QRIS untuk pembayaran.
      </p>

      <form id="orderForm" class="order-form">
        <input type="text" name="buyer_name" placeholder="Nama kamu" required>
        <input type="text" name="buyer_contact" placeholder="Instagram / WA / Email" required>
        <textarea name="note" rows="2" placeholder="Catatan (opsional)"></textarea>
        <button type="submit" class="instagram-button">Lanjut ke Pembayaran ✦</button>
      </form>

      <div id="qrisArea" class="qris-area" hidden>
        <p>Scan QRIS di bawah ya ♡</p>
        <img src="qris.jpg" alt="QRIS" class="qris-img" id="qrisImg">
        <p class="hello-footer">Setelah transfer, konfirmasi via Instagram @kknjau</p>
        <a href="https://instagram.com/kknjau" target="_blank" rel="noopener" class="instagram-button">Konfirmasi di Instagram ↗</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => modal.remove();
  document.getElementById('orderClose').onclick = close;
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      product_id: product.id,
      product_name: product.name,
      buyer_name: fd.get('buyer_name').trim(),
      buyer_contact: fd.get('buyer_contact').trim(),
      note: fd.get('note').trim()
    };

    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';

    // Coba simpan ke Orders (jika API sudah siap)
    try {
      await NJA.createOrder(data);
    } catch (_) {}

    // Tampilkan QRIS
    e.target.hidden = true;
    document.getElementById('qrisArea').hidden = false;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Auto load saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  // Delay sedikit supaya tidak bentrok dengan reveal
  setTimeout(loadStoreProducts, 300);
});

// Expose untuk admin refresh
window.loadStoreProducts = loadStoreProducts;
