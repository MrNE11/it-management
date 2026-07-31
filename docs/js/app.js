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

// ================= Credentials Vault (still mock — see note) =================
// Not yet connected to Supabase: the `credentials` table exists and RLS is
// on, but real passwords need a server-side encrypt/decrypt layer (a
// Supabase Edge Function holding the pgcrypto passphrase) before it's safe
// to store or read them for real. Wiring this to the DB today would mean
// either plaintext-in-DB or a decrypt key exposed in client JS — neither is
// acceptable for real server/FTP/admin passwords. Ask when ready to build
// that piece.

const credentials = [];

function renderCredentials() {
  const body = document.getElementById("credentialsTableBody");
  if (!body) return;
  if (credentials.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty-note">ยังไม่มีข้อมูลบัญชี</td></tr>`;
    return;
  }
  body.innerHTML = credentials.map((c, i) => `
    <tr>
      <td><div class="cell-main">${c.name}</div>${c.stale ? '<div class="cell-sub" style="color:var(--warn)">ควรเปลี่ยนรหัสผ่าน</div>' : ''}</td>
      <td><span class="badge ${c.tone}">${c.type}</span></td>
      <td>${c.host}</td>
      <td>${c.username}</td>
      <td>
        <div class="cred-pass-cell">
          <span class="cred-pass-text" data-pass-text data-index="${i}">••••••••••••</span>
          <button class="icon-btn-sm" data-toggle-pass data-index="${i}" title="แสดง/ซ่อนรหัสผ่าน">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="icon-btn-sm" data-copy-pass data-index="${i}" title="คัดลอกรหัสผ่าน">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </td>
      <td>${c.owner}</td>
      <td>${c.updated}</td>
    </tr>
  `).join("");
}

const eyeOffIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.6 18.6 0 0 1 4.2-5.2M9.9 4.2A9.9 9.9 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M2 2l20 20"/></svg>`;
const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>`;

document.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-toggle-pass]");
  const copyBtn = e.target.closest("[data-copy-pass]");

  if (toggleBtn) {
    const idx = Number(toggleBtn.dataset.index);
    const textEl = document.querySelector(`[data-pass-text][data-index="${idx}"]`);
    const isMasked = textEl.dataset.visible !== "true";
    textEl.textContent = isMasked ? credentials[idx].password : "••••••••••••";
    textEl.dataset.visible = isMasked ? "true" : "false";
    toggleBtn.innerHTML = isMasked ? eyeOffIcon : eyeIcon;
  }

  if (copyBtn) {
    const idx = Number(copyBtn.dataset.index);
    navigator.clipboard.writeText(credentials[idx].password).then(() => {
      copyBtn.innerHTML = checkIcon;
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.innerHTML = copyIcon;
        copyBtn.classList.remove("copied");
      }, 1200);
    });
  }
});

// ================= Entry point (called by auth.js once signed in) =================

window.initDashboard = async function initDashboard() {
  renderCredentials();
};
