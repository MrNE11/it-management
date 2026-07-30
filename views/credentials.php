        <div class="security-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
          <div>
            <strong>หน้านี้เป็น UI ตัวอย่าง (Mock UI) — ยังไม่มีการเข้ารหัสหรือจัดเก็บจริง</strong>
            <span>ข้อมูลที่แสดงเป็นข้อมูลสมมติทั้งหมด เมื่อพัฒนาต่อเป็นระบบจริงควรเข้ารหัสรหัสผ่านแบบ AES-256 ที่ปลายทาง (ไม่เก็บ plaintext), บังคับใช้ 2FA สำหรับผู้เข้าถึง, จำกัดสิทธิ์ตาม role และบันทึก audit log ทุกครั้งที่มีการดูหรือคัดลอกรหัสผ่าน</span>
          </div>
        </div>

        <div class="grid grid-4" style="margin-bottom:16px;">
          <div class="card kpi">
            <div class="kpi-icon tone-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.9 12.1 8.6-8.6M16 6l2.5 2.5M19 3l2 2"/></svg></div>
            <div class="kpi-value">8</div><div class="kpi-label">บัญชีที่จัดเก็บทั้งหมด</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
            <div class="kpi-value">6</div><div class="kpi-label">หมวดหมู่ (Server, FTP, Web Admin ฯลฯ)</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
            <div class="kpi-value">1</div><div class="kpi-label">รหัสผ่านเกิน 90 วัน ควรเปลี่ยน</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/></svg></div>
            <div class="kpi-value">4</div><div class="kpi-label">ผู้ดูแลที่มีสิทธิ์เข้าถึง</div>
          </div>
        </div>

        <div class="card">
          <div class="filters">
            <div class="chip active">ทั้งหมด</div>
            <div class="chip">Server (SSH)</div>
            <div class="chip">FTP</div>
            <div class="chip">Web Admin</div>
            <div class="chip">Database</div>
            <div class="chip">Email</div>
            <div class="chip">Domain & DNS</div>
            <button class="btn btn-outline btn-sm" style="margin-left:auto;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M12 5v14M5 12h14"/></svg>
              เพิ่มข้อมูลบัญชี
            </button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>บริการ</th><th>ประเภท</th><th>Host / URL</th><th>Username</th><th>Password</th><th>ผู้ดูแล</th><th>อัปเดตล่าสุด</th></tr></thead>
              <tbody id="credentialsTableBody"></tbody>
            </table>
          </div>
        </div>
