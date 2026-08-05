        <div class="grid grid-4" style="margin-bottom:16px;">
          <div class="card kpi">
            <div class="kpi-icon tone-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.9 12.1 8.6-8.6M16 6l2.5 2.5M19 3l2 2"/></svg></div>
            <div class="kpi-value" id="kpiTotal">0</div><div class="kpi-label">บัญชีที่จัดเก็บทั้งหมด</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
            <div class="kpi-value" id="kpiCategories">0</div><div class="kpi-label">หมวดหมู่ (Server, FTP, Web Admin ฯลฯ)</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
            <div class="kpi-value" id="kpiStale">0</div><div class="kpi-label">รหัสผ่านเกิน 90 วัน ควรเปลี่ยน</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/></svg></div>
            <div class="kpi-value" id="kpiOwners">0</div><div class="kpi-label">ผู้ดูแลที่มีสิทธิ์เข้าถึง</div>
          </div>
        </div>

        <div class="card">
          <div class="filters" id="credentialFilters">
            <div class="chip active" data-category="">ทั้งหมด</div>
            <div class="chip" data-category="Server (SSH)">Server (SSH)</div>
            <div class="chip" data-category="FTP">FTP</div>
            <div class="chip" data-category="Web Admin">Web Admin</div>
            <div class="chip" data-category="Database">Database</div>
            <div class="chip" data-category="Email">Email</div>
            <div class="chip" data-category="Domain & DNS">Domain & DNS</div>
            <button class="btn btn-outline btn-sm" id="openAddCredentialBtn" style="margin-left:auto;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M12 5v14M5 12h14"/></svg>
              เพิ่มข้อมูลบัญชี
            </button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th id="sortByName" style="cursor:pointer;user-select:none;">บริการ <span id="sortByNameIcon"></span></th><th>ประเภท</th><th>Host</th><th>ลิงก์</th><th>Username</th><th>Password</th><th>ผู้ดูแล</th><th>อัปเดตล่าสุด</th><th></th></tr></thead>
              <tbody id="credentialsTableBody"></tbody>
            </table>
          </div>
        </div>

        <!-- ============ ADD CREDENTIAL MODAL ============ -->
        <div class="modal-overlay" id="addCredentialOverlay" style="display:none;">
          <form class="modal-card" id="addCredentialForm">
            <div class="modal-head">
              <h3 id="addModalTitle">เพิ่มข้อมูลบัญชี</h3>
              <button type="button" class="icon-btn" id="closeAddCredentialBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="auth-field">
              <label for="cf_service_name">ชื่อบริการ</label>
              <input type="text" id="cf_service_name" placeholder="เช่น Production Web Server" required />
            </div>

            <div class="auth-field">
              <label for="cf_category">ประเภท</label>
              <select id="cf_category" class="select" style="width:100%;" required>
                <option value="Server (SSH)">Server (SSH)</option>
                <option value="FTP">FTP</option>
                <option value="Web Admin">Web Admin</option>
                <option value="Database">Database</option>
                <option value="Email">Email</option>
                <option value="Domain & DNS">Domain & DNS</option>
              </select>
            </div>

            <div class="auth-field">
              <label for="cf_host">Host</label>
              <input type="text" id="cf_host" placeholder="เช่น 192.168.10.15 : 22" />
            </div>

            <div class="auth-field">
              <label for="cf_url">ลิงก์ (ไม่บังคับ)</label>
              <input type="url" id="cf_url" placeholder="เช่น https://tedet.or.th/wp-admin" />
            </div>

            <div class="auth-field">
              <label for="cf_username">Username</label>
              <input type="text" id="cf_username" placeholder="เช่น root" />
            </div>

            <div class="auth-field">
              <label for="cf_password">Password</label>
              <input type="text" id="cf_password" autocomplete="off" required />
            </div>

            <div class="auth-field">
              <label for="cf_owner">ผู้ดูแล (ไม่บังคับ)</label>
              <input type="text" id="cf_owner" placeholder="เช่น Nattanon K." />
            </div>

            <div class="auth-field" style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="cf_is_stale" style="width:auto;" />
              <label for="cf_is_stale" style="margin:0;">รหัสผ่านนี้เกิน 90 วันแล้ว (ควรเปลี่ยน)</label>
            </div>

            <div class="auth-field">
              <label>แชร์ให้เห็นเพิ่มเติม (ไม่บังคับ)</label>
              <div class="share-list" id="shareUserList">
                <div class="empty-note" style="padding:10px 0;">กำลังโหลดรายชื่อผู้ใช้งาน...</div>
              </div>
            </div>

            <div class="auth-error" id="addCredentialError" style="display:none;"></div>

            <button type="submit" class="btn btn-primary" id="addCredentialSubmit" style="width:100%;justify-content:center;">บันทึกข้อมูล</button>
          </form>
        </div>

        <!-- ============ CONFIRM MODAL ============ -->
        <div class="modal-overlay" id="confirmOverlay" style="display:none;">
          <div class="modal-card" style="max-width:340px;">
            <div class="modal-head">
              <h3>ยืนยันการลบ</h3>
              <button type="button" class="icon-btn" id="confirmCancelX">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p id="confirmMessage" style="font-size:13.5px;color:var(--text-dim);margin:0 0 18px;"></p>
            <div style="display:flex;gap:10px;">
              <button type="button" class="btn btn-outline" id="confirmCancelBtn" style="flex:1;justify-content:center;">ยกเลิก</button>
              <button type="button" class="btn btn-primary" id="confirmOkBtn" style="flex:1;justify-content:center;background:var(--danger);">ลบ</button>
            </div>
          </div>
        </div>

        <!-- ============ TOAST ============ -->
        <div id="toast" class="toast" style="display:none;"></div>
