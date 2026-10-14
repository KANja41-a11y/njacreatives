/**
 * NJAcreative API Client
 * Semua komunikasi ke Google Apps Script
 * Password & config TIDAK disimpan di sini.
 */

const NJA = {
  // ⚠️ Ganti dengan URL Web App hasil Deploy Apps Script kamu
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',

  // Token disimpan di sessionStorage (hilang saat tab ditutup)
  getToken() {
    return sessionStorage.getItem('nja_admin_token') || '';
  },
  setToken(token) {
    sessionStorage.setItem('nja_admin_token', token);
  },
  clearToken() {
    sessionStorage.removeItem('nja_admin_token');
  },

  async request(action, body = {}, method = 'POST') {
    const payload = { action, ...body };
    if (this.getToken()) payload.token = this.getToken();

    try {
      const res = await fetch(this.API_URL, {
        method: 'POST',
        // Apps Script web app biasanya lebih stabil dengan text/plain
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('NJA API error:', err);
      return { success: false, message: err.message || 'Network error' };
    }
  },

  // Public
  getProducts() {
    return this.request('getProducts');
  },
  getSettings() {
    return this.request('getSettings');
  },

  // Auth
  login(password) {
    return this.request('login', { password });
  },
  checkAuth() {
    return this.request('checkAuth', { token: this.getToken() });
  },

  // Admin CRUD
  listAllProducts() {
    return this.request('listAllProducts');
  },
  createProduct(data) {
    return this.request('createProduct', data);
  },
  updateProduct(data) {
    return this.request('updateProduct', data);
  },
  deleteProduct(id) {
    return this.request('deleteProduct', { id });
  },
  changePassword(newPassword) {
    return this.request('changePassword', { newPassword });
  },
  updateSetting(key, value) {
    return this.request('updateSetting', { key, value });
  },

  // Orders (opsional)
  createOrder(data) {
    return this.request('createOrder', data);
  },
  listOrders() {
    return this.request('listOrders');
  },
  updateOrderStatus(id, status) {
    return this.request('updateOrderStatus', { id, status });
  }
};
