// ─── API helper functions ─────────────────────────────────────────────────────
const BASE = '';
const NO_CACHE = { cache: 'no-store' };

// ─── Auth helper ──────────────────────────────────────────────────────────────
function authHeaders() {
  try {
    const raw = sessionStorage.getItem('aban_admin_session');
    if (!raw) return {};
    const session = JSON.parse(raw);
    if (session?.token && session?.expires > Date.now()) {
      return { Authorization: `Bearer ${session.token}` };
    }
  } catch {}
  return {};
}

// ── Articles ──────────────────────────────────────────────────────────────────
export const articlesApi = {
  getAll: () => fetch(`${BASE}/api/articles`, NO_CACHE).then(r => r.json()),
  create: (data) => fetch(`${BASE}/api/articles`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`${BASE}/api/articles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/api/articles/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Portfolio ─────────────────────────────────────────────────────────────────
export const portfolioApi = {
  getAll: () => fetch(`${BASE}/api/portfolio`, NO_CACHE).then(r => r.json()),
  create: (data) => fetch(`${BASE}/api/portfolio`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`${BASE}/api/portfolio/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/api/portfolio/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Banners ───────────────────────────────────────────────────────────────────
export const bannersApi = {
  getAll: () => fetch(`${BASE}/api/banners`, NO_CACHE).then(r => r.json()),
  create: (data) => fetch(`${BASE}/api/banners`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`${BASE}/api/banners/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/api/banners/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Section Images ───────────────────────────────────────────────────────────
export const sectionImagesApi = {
  getAll: (sectionId) => fetch(`/api/section-images${sectionId ? `?section=${sectionId}` : ''}`, { cache: 'no-store' }).then(r => r.json()),
  create: (data) => fetch(`/api/section-images`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`/api/section-images/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`/api/section-images/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Home Sections (hero + homepage section cards) ────────────────────────────
export const homeSectionsApi = {
  getAll: (includeHidden = false) => fetch(`/api/home-sections${includeHidden ? '?all=1' : ''}`, { cache: 'no-store' }).then(r => r.json()),
  create: (data) => fetch(`/api/home-sections`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`/api/home-sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`/api/home-sections/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Article Categories ───────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => fetch(`/api/categories`, { cache: 'no-store' }).then(r => r.json()),
  create: (data) => fetch(`/api/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Sub Companies ────────────────────────────────────────────────────────────
export const subCompaniesApi = {
  getAll: () => fetch(`/api/subcompanies`, { cache: 'no-store' }).then(r => r.json()),
  create: (data) => fetch(`/api/subcompanies`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id, data) => fetch(`/api/subcompanies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`/api/subcompanies/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(r => r.json()),
};

// ── Site Content (home/about/contact/services) ────────────────────────────────
export const contentApi = {
  getAll: () => fetch(`${BASE}/api/content`, NO_CACHE).then(r => r.json()),
  set: (key, value) => fetch(`${BASE}/api/content`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ key, value }) }).then(r => r.json()),
  setMany: async (items) => {
    const results = [];
    for (const item of items) {
      try {
        const res = await fetch(`${BASE}/api/content`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(item) });
        results.push(await res.json());
      } catch (e) {
        console.error('setMany error for key:', item.key, e);
      }
    }
    return results;
  },
};