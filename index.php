<!doctype html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>IT Support Dashboard</title>
<link rel="stylesheet" href="css/style.css" />
</head>
<body>

<!-- ============ LOGIN GATE ============ -->
<div class="auth-gate" id="authGate">
  <form class="auth-card" id="loginForm">
    <div class="brand-mark" style="width:44px;height:44px;font-size:17px;margin:0 auto 14px;">IT</div>
    <h1>IT Support Hub</h1>
    <p id="authSubtitle">เข้าสู่ระบบด้วยบัญชีที่ได้รับอนุญาต</p>
    <div class="auth-field">
      <label for="loginEmail">ชื่อผู้ใช้งาน</label>
      <input type="text" id="loginEmail" autocomplete="username" placeholder="username" autocapitalize="off" required />
    </div>
    <div class="auth-field">
      <label for="loginPassword">รหัสผ่าน</label>
      <input type="password" id="loginPassword" autocomplete="current-password" minlength="6" required />
    </div>
    <div class="auth-error" id="authError" style="display:none;"></div>
    <div class="auth-success" id="authSuccess" style="display:none;"></div>
    <button type="submit" class="btn btn-primary" id="loginSubmit" style="width:100%;justify-content:center;">เข้าสู่ระบบ</button>
  </form>
</div>

<div class="app" id="appRoot" style="display:none;">

  <!-- ============ SIDEBAR ============ -->
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <div class="brand-mark">IT</div>
      <div class="brand-text">
        <strong>IT Support Hub</strong>
        <span>Internal Management Console</span>
      </div>
    </div>

    <nav class="nav-group">
      <div class="nav-label">Infrastructure</div>
      <div class="nav-item active" data-view="credentials">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.9 12.1 8.6-8.6M16 6l2.5 2.5M19 3l2 2"/></svg>
        Credentials Vault
        <span class="nav-badge">0</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="avatar" id="userAvatar">NK</div>
      <div class="who">
        <strong id="userName">Nattanon K.</strong>
        <span id="userEmail">IT Administrator</span>
      </div>
      <button class="icon-btn" id="signOutBtn" title="ออกจากระบบ" style="margin-left:auto;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
      </button>
    </div>
  </aside>

  <!-- ============ MAIN ============ -->
  <div class="main">
    <header class="topbar">
      <button class="icon-btn" id="menuToggle" style="display:none">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <div>
        <div class="page-title" id="pageTitle">Credentials Vault</div>
        <div class="page-sub" id="pageSub">จัดเก็บข้อมูลเข้าสู่ระบบ Server, FTP และเว็บ Admin ต่างๆ</div>
      </div>
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="credentialSearch" placeholder="ค้นหาบัญชี..." />
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
          <span class="dot"></span>
        </button>
        <button class="icon-btn" id="themeToggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2.2M19.8 12H22M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/></svg>
        </button>
      </div>
    </header>

    <main class="content">

      <!-- ============ CREDENTIALS VAULT ============ -->
      <section class="view active" id="view-credentials">
        <?php include __DIR__ . '/views/credentials.php'; ?>
      </section>

    </main>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
<script src="js/auth.js"></script>
<script src="js/app.js"></script>
</body>
</html>
