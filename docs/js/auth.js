// ===== Auth gate: Supabase email/password sign-in =====

const authGate = document.getElementById("authGate");
const appRoot = document.getElementById("appRoot");
const loginForm = document.getElementById("loginForm");
const authError = document.getElementById("authError");
const loginSubmit = document.getElementById("loginSubmit");
const signOutBtn = document.getElementById("signOutBtn");

function showApp(session) {
  authGate.style.display = "none";
  appRoot.style.display = "";
  const email = session?.user?.email || "";
  document.getElementById("userEmail").textContent = email;
  document.getElementById("userName").textContent = email.split("@")[0] || "ผู้ใช้งาน";
  document.getElementById("userAvatar").textContent = (email[0] || "U").toUpperCase();
  if (window.initDashboard) window.initDashboard();
}

function showLogin() {
  appRoot.style.display = "none";
  authGate.style.display = "flex";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.style.display = "none";
  loginSubmit.disabled = true;
  loginSubmit.textContent = "กำลังเข้าสู่ระบบ...";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  loginSubmit.disabled = false;
  loginSubmit.textContent = "เข้าสู่ระบบ";

  if (error) {
    authError.textContent = "เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    authError.style.display = "block";
    return;
  }
  showApp(data.session);
});

signOutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

(async function initAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showApp(data.session);
  } else {
    showLogin();
  }
})();

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") showLogin();
});
