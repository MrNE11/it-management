// ===== IT Support Dashboard =====
// Tickets, Assets, Websites, Backup Jobs, Users, Knowledge Base are backed
// by Supabase (see supabase/schema.sql). Credentials Vault is intentionally
// still mock data — see the note above renderCredentials() for why.

const pageMeta = {
  overview:  { title: "Dashboard Overview",      sub: "สรุปภาพรวมการทำงานของฝ่าย IT Support" },
  tickets:   { title: "Tickets",                 sub: "จัดการคำร้องขอความช่วยเหลือจากผู้ใช้งาน" },
  knowledge: { title: "Knowledge Base",          sub: "คู่มือและบทความช่วยเหลือสำหรับผู้ใช้งานและทีม IT" },
  assets:    { title: "Assets & Inventory",      sub: "ทะเบียนอุปกรณ์และครุภัณฑ์ IT ทั้งหมด" },
  websites:  { title: "Websites",                sub: "ภาพรวมเว็บไซต์ทั้งหมดที่ฝ่าย IT ดูแล" },
  network:   { title: "Network Monitor",         sub: "ตรวจสอบสถานะเครือข่ายและอุปกรณ์แบบเรียลไทม์" },
  security:  { title: "Security",                sub: "ภาพรวมความปลอดภัยระบบและช่องโหว่" },
  backup:    { title: "Backup & Storage",        sub: "สถานะงานสำรองข้อมูลและพื้นที่จัดเก็บ" },
  credentials: { title: "Credentials Vault",     sub: "จัดเก็บข้อมูลเข้าสู่ระบบ Server, FTP และเว็บ Admin ต่างๆ" },
  users:     { title: "Users & Devices",         sub: "ผู้ใช้งานในองค์กรและอุปกรณ์ที่ถือครอง" },
  reports:   { title: "Reports & Analytics",     sub: "รายงานสรุปประสิทธิภาพการทำงานของฝ่าย IT" },
  settings:  { title: "Settings",                sub: "ตั้งค่าระบบ การแจ้งเตือน และสิทธิ์การเข้าถึง" },
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

document.querySelectorAll("[data-goto]").forEach(el => {
  el.addEventListener("click", () => setView(el.dataset.goto));
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

// ---------- Settings switches (delegated — also covers switches loaded via include) ----------
document.addEventListener("click", (e) => {
  const sw = e.target.closest("[data-switch]");
  if (sw) sw.classList.toggle("on");
});

// ---------- Filter chips, visual only (delegated — also covers chips loaded via include) ----------
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".filters .chip");
  if (!chip) return;
  const group = chip.closest(".filters");
  group.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
});

// ---------- New Ticket button (placeholder) ----------
document.getElementById("newTicketBtn").addEventListener("click", () => {
  setView("tickets");
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

function formatWarranty(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatViews(n) {
  if (n == null) return "0";
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

function loadError(el, colspan, err) {
  el.innerHTML = `<tr><td colspan="${colspan}" class="empty-note">โหลดข้อมูลไม่สำเร็จ: ${err.message}</td></tr>`;
}

// ================= Tickets (Supabase) =================

const priorityLabel = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
const statusBadge = {
  "Open": "badge-blue", "In Progress": "badge-amber", "Escalated": "badge-red",
  "Resolved": "badge-green", "Pending": "badge-gray",
};

async function loadTickets() {
  const body = document.getElementById("ticketsTableBody");
  const { data, error } = await supabaseClient
    .from("tickets")
    .select("ticket_number, subject, category, priority, status, updated_at, reporter:reporter_id(full_name, initials), assignee:assignee_id(full_name)")
    .order("updated_at", { ascending: false });

  if (error) return loadError(body, 8, error);

  const badge = document.getElementById("ticketsNavBadge");
  if (badge) badge.textContent = data.length;

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="empty-note">ยังไม่มีข้อมูล Ticket</td></tr>`;
    return;
  }

  body.innerHTML = data.map(t => `
    <tr>
      <td class="cell-main">#${t.ticket_number}</td>
      <td><div class="cell-main">${t.subject}</div><div class="cell-sub">${t.category}</div></td>
      <td><span class="mini-avatar">${t.reporter?.initials || "?"}</span>${t.reporter?.full_name || "-"}</td>
      <td>${t.assignee?.full_name || "—"}</td>
      <td><span class="priority-dot p-${t.priority}">${priorityLabel[t.priority]}</span></td>
      <td><span class="badge ${statusBadge[t.status] || "badge-gray"}">${t.status}</span></td>
      <td>${relativeThai(t.updated_at)}</td>
      <td><button class="btn btn-ghost btn-sm">เปิดดู</button></td>
    </tr>
  `).join("");
}

// ================= Assets (Supabase) =================

const assetStatusBadge = { Active: "badge-green", Repair: "badge-red", Retired: "badge-gray" };

async function loadAssets() {
  const body = document.getElementById("assetsTableBody");
  const { data, error } = await supabaseClient.from("assets").select("*").order("asset_tag");
  if (error) return loadError(body, 6, error);

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="empty-note">ยังไม่มีข้อมูลอุปกรณ์</td></tr>`;
    return;
  }

  body.innerHTML = data.map(a => `
    <tr>
      <td class="cell-main">${a.asset_tag}</td>
      <td>${a.name}</td>
      <td>${a.type}</td>
      <td>${a.holder || "—"}</td>
      <td><span class="badge ${assetStatusBadge[a.status]}">${a.status}</span></td>
      <td>${formatWarranty(a.warranty_until)}</td>
    </tr>
  `).join("");
}

// ================= Websites (Supabase) =================

const websiteStatusBadge = { Online: "badge-green", Maintenance: "badge-amber", Degraded: "badge-amber", Offline: "badge-red" };
const sslBadge = { "Valid": "badge-green", "Expiring Soon": "badge-amber", "Expired": "badge-red", "Internal Only": "badge-gray" };

async function loadWebsites() {
  const body = document.getElementById("websitesTableBody");
  const { data, error } = await supabaseClient
    .from("websites")
    .select("*, owner:owner_id(full_name)")
    .order("name");
  if (error) return loadError(body, 8, error);

  const badge = document.getElementById("websitesNavBadge");
  if (badge) badge.textContent = data.length;

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="empty-note">ยังไม่มีข้อมูลเว็บไซต์</td></tr>`;
    return;
  }

  body.innerHTML = data.map(w => `
    <tr>
      <td><div class="cell-main">${w.name}</div><div class="cell-sub">${w.url}</div></td>
      <td>${w.tech_stack || "—"}</td>
      <td>${w.hosting || "—"}</td>
      <td><span class="badge ${websiteStatusBadge[w.status]}">${w.status}</span></td>
      <td><span class="badge ${sslBadge[w.ssl_status]}">${w.ssl_status}</span></td>
      <td>${w.uptime_pct != null ? w.uptime_pct + "%" : "—"}</td>
      <td>${w.owner?.full_name || "—"}</td>
      <td>${relativeThai(w.last_checked_at)}</td>
    </tr>
  `).join("");
}

// ================= Backup Jobs (Supabase) =================

const backupStatusBadge = { Success: "badge-green", Failed: "badge-red" };

async function loadBackupJobs() {
  const body = document.getElementById("backupTableBody");
  if (!body) return; // section not loaded yet
  const { data, error } = await supabaseClient.from("backup_jobs").select("*").order("started_at", { ascending: false });
  if (error) return loadError(body, 6, error);

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="empty-note">ยังไม่มีข้อมูลงาน Backup</td></tr>`;
    return;
  }

  body.innerHTML = data.map(j => `
    <tr>
      <td class="cell-main">${j.job_name}</td>
      <td>${j.job_type}</td>
      <td>${j.size_label || "—"}</td>
      <td>${new Date(j.started_at).toLocaleString("th-TH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
      <td>${j.duration_label || "—"}</td>
      <td><span class="badge ${backupStatusBadge[j.status]}">${j.status}</span></td>
    </tr>
  `).join("");
}

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

// ================= Staff / Users (Supabase) =================

const userStatusBadge = { Active: "badge-green", Suspended: "badge-red" };

async function loadStaff() {
  const body = document.getElementById("usersTableBody");
  const { data, error } = await supabaseClient.from("staff").select("*").order("full_name");
  if (error) return loadError(body, 5, error);

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="5" class="empty-note">ยังไม่มีข้อมูลผู้ใช้งาน</td></tr>`;
    return;
  }

  body.innerHTML = data.map(u => `
    <tr>
      <td><span class="mini-avatar">${u.initials}</span><span class="cell-main">${u.full_name}</span></td>
      <td>${u.department}</td>
      <td>${u.email}</td>
      <td>${u.devices || "—"}</td>
      <td><span class="badge ${userStatusBadge[u.account_status]}">${u.account_status}</span></td>
    </tr>
  `).join("");
}

// ================= Knowledge Base (Supabase) =================

const kbTagTone = { Software: "badge-blue", Hardware: "badge-purple", Account: "badge-amber", Network: "badge-green", Onboarding: "badge-gray" };

async function loadKb() {
  const grid = document.getElementById("kbGrid");
  const { data, error } = await supabaseClient.from("kb_articles").select("*").order("updated_at", { ascending: false });
  if (error) { grid.innerHTML = `<div class="empty-note">โหลดข้อมูลไม่สำเร็จ: ${error.message}</div>`; return; }

  if (data.length === 0) {
    grid.innerHTML = `<div class="empty-note">ยังไม่มีบทความ</div>`;
    return;
  }

  grid.innerHTML = data.map(a => `
    <div class="kb-card">
      <span class="badge ${kbTagTone[a.tag] || "badge-gray"} kb-tag">${a.tag}</span>
      <h4>${a.title}</h4>
      <p>${a.description || ""}</p>
      <div class="kb-meta"><span>👁 ${formatViews(a.views)} views</span><span>อัปเดต ${relativeThai(a.updated_at)}</span></div>
    </div>
  `).join("");
}

// ---------- Rack map (still mock) ----------
function renderRackMap() {
  const map = document.getElementById("rackMap");
  const states = ["ok","ok","ok","warn","ok","ok","empty","ok",
                  "ok","ok","danger","ok","ok","ok","empty","empty",
                  "ok","warn","ok","ok","ok","ok","ok","empty"];
  const colorVar = { ok: "var(--ok)", warn: "var(--warn)", danger: "var(--danger)", empty: "var(--neutral-soft)" };
  map.innerHTML = states.map(s => `<div class="map-cell" style="background:${colorVar[s]}; ${s==='empty' ? 'border:1px solid var(--border)' : ''}"></div>`).join("");
}

// ================= Entry point (called by auth.js once signed in) =================

window.initDashboard = async function initDashboard() {
  renderCredentials();
  renderRackMap();
  await Promise.all([
    loadTickets(),
    loadAssets(),
    loadWebsites(),
    loadBackupJobs(),
    loadStaff(),
    loadKb(),
  ]);
};
