// ===== Auth gate: username/password sign-in =====
// Supabase Auth is email-based, so each username is mapped to a synthetic
// email "{username}@internal.local" behind the scenes — the 4 accounts
// (non, tle, tc, aor) were created directly via the Auth API, not through
// self sign-up (which has been removed; this is now a fixed set of named
// accounts, not open registration).

const USERNAME_DOMAIN = "internal.local";

const authGate = document.getElementById("authGate");
const appRoot = document.getElementById("appRoot");
const loginForm = document.getElementById("loginForm");
const authError = document.getElementById("authError");
const loginSubmit = document.getElementById("loginSubmit");
const signOutBtn = document.getElementById("signOutBtn");

function usernameFromEmail(email) {
  return (email || "").split("@")[0] || "ผู้ใช้งาน";
}

function showApp(session) {
  authGate.style.display = "none";
  appRoot.style.display = "";
  const username = usernameFromEmail(session?.user?.email);
  document.getElementById("userEmail").textContent = username;
  document.getElementById("userName").textContent = username;
  document.getElementById("userAvatar").textContent = username[0].toUpperCase();
  if (window.initDashboard) window.initDashboard();
}

function showLogin() {
  appRoot.style.display = "none";
  authGate.style.display = "flex";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.style.display = "none";

  const username = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const email = `${username}@${USERNAME_DOMAIN}`;

  loginSubmit.disabled = true;
  loginSubmit.textContent = "กำลังเข้าสู่ระบบ...";
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  loginSubmit.disabled = false;
  loginSubmit.textContent = "เข้าสู่ระบบ";

  if (error) {
    authError.textContent = "เข้าสู่ระบบไม่สำเร็จ: ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
    authError.style.display = "block";
    return;
  }
  showApp(data.session);
});

signOutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// Deferred to DOMContentLoaded: if a session is already cached, getSession()
// can resolve before app.js (the next <script> tag) has finished executing,
// so window.initDashboard wouldn't exist yet when showApp() checks for it.
// Waiting for DOMContentLoaded guarantees every synchronous script — app.js
// included — has already run.
window.addEventListener("DOMContentLoaded", () => {
  (async function initAuth() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      showApp(data.session);
    } else {
      showLogin();
    }
  })();
});

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") showLogin();
});
