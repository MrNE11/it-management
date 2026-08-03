// ===== IT Support Dashboard =====
// Trimmed down to Credentials Vault only (other sections removed on
// request — full history for Tickets/Assets/Websites/Backup/Users/KB is
// still in git if they come back later).

const pageMeta = {
  credentials: { title: "Credentials Vault", sub: "จัดเก็บข้อมูลเข้าสู่ระบบ Server, FTP และเว็บ Admin ต่างๆ" },
};

// ---------- Navigation ----------
function setView(view) {
  document.querySelectorAll(".nav-item[data-view]").forEach(el => {
    el.classList.toggle("active", el.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach(el => {
    el.classList.toggle("active", el.id === `view-${view}`);
  });
  const meta = pageMeta[view];
  if (meta) {
    document.getElementById("pageTitle").textContent = meta.title;
    document.getElementById("pageSub").textContent = meta.sub;
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  document.getElementById("sidebar").classList.remove("open");
}

document.querySelectorAll(".nav-item[data-view]").forEach(el => {
  el.addEventListener("click", () => setView(el.dataset.view));
});

// ---------- Mobile sidebar ----------
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
function syncMenuToggle() {
  menuToggle.style.display = window.innerWidth <= 900 ? "flex" : "none";
}
syncMenuToggle();
window.addEventListener("resize", syncMenuToggle);
menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));

// ---------- Theme toggle ----------
const themeToggle = document.getElementById("themeToggle");
function applyStoredTheme() {
  const saved = localStorage.getItem("it-dash-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
}
applyStoredTheme();
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("it-dash-theme", next);
});

// ---------- Filter chips, visual only ----------
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".filters .chip");
  if (!chip) return;
  const group = chip.closest(".filters");
  group.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
});

// ================= Helpers =================

function relativeThai(dateStr) {
  if (!dateStr) return "—";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "เมื่อสักครู่";
  if (min < 60) return `${min} นาทีที่แล้ว`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ชม.ที่แล้ว`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "เมื่อวาน";
  if (day < 7) return `${day} วันที่แล้ว`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week} สัปดาห์ก่อน`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} เดือนก่อน`;
  return `${Math.floor(day / 365)} ปีก่อน`;
}

function loadError(el, colspan, err) {
  el.innerHTML = `<tr><td colspan="${colspan}" class="empty-note">โหลดข้อมูลไม่สำเร็จ: ${err.message}</td></tr>`;
}

// ================= Credentials Vault (Supabase, real encryption) =================
// Passwords are encrypted server-side (pgcrypto, via the add_credential /
// reveal_credential Postgres functions) — the passphrase never leaves the
// database and is never sent to or held in client JS. The bulk list query
// below never selects password_encrypted; a password is only fetched
// (decrypted) one row at a time via reveal_credential when the user clicks
// the eye icon.

const categoryTone = {
  "Server (SSH)": "badge-blue",
  "FTP": "badge-purple",
  "Web Admin": "badge-green",
  "Database": "badge-amber",
  "Email": "badge-gray",
  "Domain & DNS": "badge-red",
};

let allCredentials = [];
let activeCategory = "";
const revealedPasswords = new Map(); // id -> plaintext, cleared on reload

async function loadCredentials() {
  const body = document.getElementById("credentialsTableBody");
  const { data, error } = await supabaseClient
    .from("credentials")
    .select("id, service_name, category, host, username, owner_name, is_stale, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return loadError(body, 7, error);

  allCredentials = data;
  updateCredentialKpis();
  renderCredentials();
}

function updateCredentialKpis() {
  const total = allCredentials.length;
  const categories = new Set(allCredentials.map(c => c.category)).size;
  const stale = allCredentials.filter(c => c.is_stale).length;
  const owners = new Set(allCredentials.map(c => c.owner_name).filter(Boolean)).size;
  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiCategories").textContent = categories;
  document.getElementById("kpiStale").textContent = stale;
  document.getElementById("kpiOwners").textContent = owners;
  const navBadge = document.querySelector('.nav-item[data-view="credentials"] .nav-badge');
  if (navBadge) navBadge.textContent = total;
}

function renderCredentials() {
  const body = document.getElementById("credentialsTableBody");
  if (!body) return;

  const rows = activeCategory ? allCredentials.filter(c => c.category === activeCategory) : allCredentials;

  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty-note">ยังไม่มีข้อมูลบัญชี</td></tr>`;
    return;
  }

  body.innerHTML = rows.map(c => {
    const revealed = revealedPasswords.get(c.id);
    return `
    <tr>
      <td><div class="cell-main">${c.service_name}</div>${c.is_stale ? '<div class="cell-sub" style="color:var(--warn)">ควรเปลี่ยนรหัสผ่าน</div>' : ''}</td>
      <td><span class="badge ${categoryTone[c.category] || "badge-gray"}">${c.category}</span></td>
      <td>${c.host || "—"}</td>
      <td>${c.username || "—"}</td>
      <td>
        <div class="cred-pass-cell">
          <span class="cred-pass-text" data-pass-text data-id="${c.id}" data-visible="${revealed ? "true" : "false"}">${revealed || "••••••••••••"}</span>
          <button class="icon-btn-sm" data-toggle-pass data-id="${c.id}" title="แสดง/ซ่อนรหัสผ่าน">${revealed ? eyeOffIcon : eyeIcon}</button>
          <button class="icon-btn-sm" data-copy-pass data-id="${c.id}" title="คัดลอกรหัสผ่าน">${copyIcon}</button>
        </div>
      </td>
      <td>${c.owner_name || "—"}</td>
      <td>${relativeThai(c.updated_at)}</td>
    </tr>
  `;
  }).join("");
}

const eyeOffIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.6 18.6 0 0 1 4.2-5.2M9.9 4.2A9.9 9.9 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M2 2l20 20"/></svg>`;
const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>`;

async function revealPassword(id) {
  if (revealedPasswords.has(id)) return revealedPasswords.get(id);
  const { data, error } = await supabaseClient.rpc("reveal_credential", { p_id: id });
  if (error) { console.error(error); return null; }
  revealedPasswords.set(id, data);
  return data;
}

document.addEventListener("click", async (e) => {
  const toggleBtn = e.target.closest("[data-toggle-pass]");
  const copyBtn = e.target.closest("[data-copy-pass]");

  if (toggleBtn) {
    const id = toggleBtn.dataset.id;
    const textEl = document.querySelector(`[data-pass-text][data-id="${id}"]`);
    const isMasked = textEl.dataset.visible !== "true";

    if (isMasked) {
      toggleBtn.disabled = true;
      const plain = await revealPassword(id);
      toggleBtn.disabled = false;
      if (plain == null) return;
      textEl.textContent = plain;
      textEl.dataset.visible = "true";
      toggleBtn.innerHTML = eyeOffIcon;
    } else {
      textEl.textContent = "••••••••••••";
      textEl.dataset.visible = "false";
      toggleBtn.innerHTML = eyeIcon;
    }
  }

  if (copyBtn) {
    const id = copyBtn.dataset.id;
    const plain = await revealPassword(id);
    if (plain == null) return;
    navigator.clipboard.writeText(plain).then(() => {
      copyBtn.innerHTML = checkIcon;
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.innerHTML = copyIcon;
        copyBtn.classList.remove("copied");
      }, 1200);
    });
  }
});

// ---------- Category filter chips ----------
document.addEventListener("click", (e) => {
  const chip = e.target.closest("#credentialFilters .chip");
  if (!chip) return;
  activeCategory = chip.dataset.category || "";
  renderCredentials();
});

// ---------- Share-with user list ----------
let appUsers = [];

async function loadAppUsers() {
  const { data, error } = await supabaseClient.rpc("list_app_users");
  if (error) { console.error(error); return; }
  appUsers = data;
}

function renderShareList() {
  const container = document.getElementById("shareUserList");
  const others = appUsers.filter(u => u.id !== window.currentUserId);
  if (others.length === 0) {
    container.innerHTML = `<div class="empty-note" style="padding:10px 0;">ไม่มีผู้ใช้งานอื่น</div>`;
    return;
  }
  container.innerHTML = others.map(u => `
    <label class="share-row">
      <input type="checkbox" value="${u.id}" data-share-user />
      ${u.username}
    </label>
  `).join("");
}

// ---------- Add credential modal ----------
const addOverlay = document.getElementById("addCredentialOverlay");
const addForm = document.getElementById("addCredentialForm");
const addError = document.getElementById("addCredentialError");
const addSubmit = document.getElementById("addCredentialSubmit");

document.getElementById("openAddCredentialBtn").addEventListener("click", () => {
  addError.style.display = "none";
  addForm.reset();
  renderShareList();
  addOverlay.style.display = "flex";
});

document.getElementById("closeAddCredentialBtn").addEventListener("click", () => {
  addOverlay.style.display = "none";
});

addOverlay.addEventListener("click", (e) => {
  if (e.target === addOverlay) addOverlay.style.display = "none";
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  addError.style.display = "none";
  addSubmit.disabled = true;
  addSubmit.textContent = "กำลังบันทึก...";

  const sharedWith = Array.from(document.querySelectorAll("[data-share-user]:checked")).map(el => el.value);

  const { error } = await supabaseClient.rpc("add_credential", {
    p_service_name: document.getElementById("cf_service_name").value.trim(),
    p_category: document.getElementById("cf_category").value,
    p_host: document.getElementById("cf_host").value.trim() || null,
    p_username: document.getElementById("cf_username").value.trim() || null,
    p_password: document.getElementById("cf_password").value,
    p_owner_name: document.getElementById("cf_owner").value.trim() || null,
    p_is_stale: document.getElementById("cf_is_stale").checked,
    p_shared_with: sharedWith,
  });

  addSubmit.disabled = false;
  addSubmit.textContent = "บันทึกข้อมูล";

  if (error) {
    addError.textContent = "บันทึกไม่สำเร็จ: " + error.message;
    addError.style.display = "block";
    return;
  }

  addOverlay.style.display = "none";
  await loadCredentials();
});

// ================= Entry point (called by auth.js once signed in) =================

window.initDashboard = async function initDashboard() {
  await Promise.all([loadCredentials(), loadAppUsers()]);
};
