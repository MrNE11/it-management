// ===== Auth gate: Supabase email/password sign-in + sign-up =====

const ALLOWED_EMAIL_DOMAIN = "edupark.co.th";

const authGate = document.getElementById("authGate");
const appRoot = document.getElementById("appRoot");
const loginForm = document.getElementById("loginForm");
const authError = document.getElementById("authError");
const authSuccess = document.getElementById("authSuccess");
const authSubtitle = document.getElementById("authSubtitle");
const loginSubmit = document.getElementById("loginSubmit");
const authModeToggle = document.getElementById("authModeToggle");
const signOutBtn = document.getElementById("signOutBtn");

let authMode = "signin"; // "signin" | "signup"

function setAuthMode(mode) {
  authMode = mode;
  authError.style.display = "none";
  authSuccess.style.display = "none";
  if (mode === "signup") {
    authSubtitle.textContent = `สมัครสมาชิกด้วยอีเมลบริษัท (@${ALLOWED_EMAIL_DOMAIN})`;
    loginSubmit.textContent = "สมัครสมาชิก";
    authModeToggle.textContent = "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ";
  } else {
    authSubtitle.textContent = "เข้าสู่ระบบด้วยบัญชีที่ได้รับอนุญาต";
    loginSubmit.textContent = "เข้าสู่ระบบ";
    authModeToggle.textContent = "ยังไม่มีบัญชี? สมัครสมาชิก";
  }
}

authModeToggle.addEventListener("click", () => {
  setAuthMode(authMode === "signin" ? "signup" : "signin");
});

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
  authSuccess.style.display = "none";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (authMode === "signup") {
    if (!email.toLowerCase().endsWith("@" + ALLOWED_EMAIL_DOMAIN)) {
      authError.textContent = `สมัครสมาชิกได้เฉพาะอีเมล @${ALLOWED_EMAIL_DOMAIN} เท่านั้น`;
      authError.style.display = "block";
      return;
    }

    loginSubmit.disabled = true;
    loginSubmit.textContent = "กำลังสมัครสมาชิก...";
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    loginSubmit.disabled = false;
    loginSubmit.textContent = "สมัครสมาชิก";

    if (error) {
      authError.textContent = error.message.includes("restricted")
        ? `สมัครสมาชิกได้เฉพาะอีเมล @${ALLOWED_EMAIL_DOMAIN} เท่านั้น`
        : "สมัครสมาชิกไม่สำเร็จ: " + error.message;
      authError.style.display = "block";
      return;
    }

    if (data.session) {
      showApp(data.session);
    } else {
      authSuccess.textContent = "สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ";
      authSuccess.style.display = "block";
      setAuthMode("signin");
    }
    return;
  }

  loginSubmit.disabled = true;
  loginSubmit.textContent = "กำลังเข้าสู่ระบบ...";
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
