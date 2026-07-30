        <div class="grid grid-4" style="margin-bottom:16px;">
          <div class="card kpi">
            <div class="kpi-icon tone-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg></div>
            <div class="kpi-value">10</div><div class="kpi-label">เว็บไซต์ที่ดูแลทั้งหมด</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg></div>
            <div class="kpi-value">7</div><div class="kpi-label">Online / ใช้งานปกติ</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
            <div class="kpi-value">4</div><div class="kpi-label">ต้องดำเนินการ (SSL / Maintenance / Down)</div>
          </div>
          <div class="card kpi">
            <div class="kpi-icon tone-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
            <div class="kpi-value">99.1%</div><div class="kpi-label">Uptime เฉลี่ย (30 วัน)</div>
          </div>
        </div>

        <div class="grid grid-split" style="margin-bottom:16px;">
          <div class="card">
            <div class="card-head"><div><h3>รายการที่ต้องดำเนินการ</h3><p>เว็บไซต์ที่มีปัญหาหรือ SSL ใกล้หมดอายุ</p></div></div>
            <div class="list">
              <div class="list-row">
                <div class="list-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
                <div class="list-main"><strong>พอร์ทัลโรงเรียนพันธมิตร</strong><span>อยู่ระหว่างปิดปรับปรุงระบบ (Maintenance Mode)</span></div>
                <span class="badge badge-amber">Maintenance</span>
              </div>
              <div class="list-row">
                <div class="list-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
                <div class="list-main"><strong>เว็บไซต์ศิษย์เก่า</strong><span>ใบรับรอง SSL จะหมดอายุใน 6 วัน</span></div>
                <span class="badge badge-amber">SSL Expiring</span>
              </div>
              <div class="list-row">
                <div class="list-icon tone-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></div>
                <div class="list-main"><strong>ร้านค้าออนไลน์</strong><span>เวลาโหลดหน้าเว็บช้ากว่าปกติ (Response Time สูง)</span></div>
                <span class="badge badge-amber">Degraded</span>
              </div>
              <div class="list-row">
                <div class="list-icon tone-red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
                <div class="list-main"><strong>เว็บไซต์เก่า (Archive)</strong><span>ปิดให้บริการแล้ว และ SSL หมดอายุ</span></div>
                <span class="badge badge-red">Offline</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head"><div><h3>เทคโนโลยีที่ใช้</h3><p>สัดส่วนตามเทคโนโลยีของเว็บไซต์ทั้งหมด</p></div></div>
            <div class="donut-wrap">
              <svg width="120" height="120" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--neutral-soft)" stroke-width="6"></circle>
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--accent)" stroke-width="6" stroke-dasharray="30 70" stroke-dashoffset="25" transform="rotate(-90 21 21)"></circle>
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--info)" stroke-width="6" stroke-dasharray="30 70" stroke-dashoffset="-5" transform="rotate(-90 21 21)"></circle>
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--warn)" stroke-width="6" stroke-dasharray="20 80" stroke-dashoffset="-35" transform="rotate(-90 21 21)"></circle>
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--ok)" stroke-width="6" stroke-dasharray="20 80" stroke-dashoffset="-55" transform="rotate(-90 21 21)"></circle>
              </svg>
              <div class="donut-legend">
                <div class="legend-item"><span class="legend-dot" style="background:var(--accent)"></span>ASP Classic / .NET<span class="val">30%</span></div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--info)"></span>WordPress<span class="val">30%</span></div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--warn)"></span>PHP Framework<span class="val">20%</span></div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--ok)"></span>Next.js / Static<span class="val">20%</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="filters">
            <div class="chip active">ทั้งหมด</div>
            <div class="chip">Online</div>
            <div class="chip">Maintenance</div>
            <div class="chip">Degraded</div>
            <div class="chip">Offline</div>
            <button class="btn btn-outline btn-sm" style="margin-left:auto;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M12 5v14M5 12h14"/></svg>
              เพิ่มเว็บไซต์
            </button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>เว็บไซต์</th><th>เทคโนโลยี</th><th>Hosting</th><th>สถานะ</th><th>SSL</th><th>Uptime (30 วัน)</th><th>ผู้ดูแล</th><th>ตรวจสอบล่าสุด</th></tr></thead>
              <tbody id="websitesTableBody"></tbody>
            </table>
          </div>
        </div>
