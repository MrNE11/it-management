        <div class="grid grid-4" style="margin-bottom:16px;">
          <div class="card kpi"><div class="kpi-icon tone-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg></div><div class="kpi-value">27/28</div><div class="kpi-label">งาน Backup สำเร็จ (7 วัน)</div></div>
          <div class="card kpi"><div class="kpi-icon tone-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="8" ry="3"/></svg></div><div class="kpi-value">18.4 TB</div><div class="kpi-label">พื้นที่ใช้งาน Backup</div></div>
          <div class="card kpi"><div class="kpi-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div><div class="kpi-value">82%</div><div class="kpi-label">File Server Storage</div></div>
          <div class="card kpi"><div class="kpi-icon tone-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div><div class="kpi-value">4 ชม.</div><div class="kpi-label">RPO เป้าหมาย</div></div>
        </div>

        <div class="card">
          <div class="card-head"><div><h3>Backup Jobs</h3><p>ประวัติงานสำรองข้อมูลล่าสุด</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>งาน</th><th>ประเภท</th><th>ขนาด</th><th>เริ่ม</th><th>ใช้เวลา</th><th>สถานะ</th></tr></thead>
              <tbody id="backupTableBody"></tbody>
            </table>
          </div>
        </div>
