-- ============================================================
-- Seed data — mirrors the mock data that was previously hardcoded
-- in js/app.js, now living in the real tables.
-- Safe to re-run: skips rows that already exist (by unique key).
-- ============================================================

-- ---------- staff ----------
insert into staff (full_name, initials, department, email, role, account_status, devices) values
  ('Nattanon K.', 'NK', 'ฝ่าย IT', 'nattanon.k@tedet.or.th', 'IT Administrator', 'Active', null),
  ('ธีรพงษ์ ใจดี', 'ธใ', 'ฝ่าย IT', 'teerapong.j@tedet.or.th', 'Support Technician', 'Active', null),
  ('สุนิสา แก้วมณี', 'สแ', 'ฝ่าย IT', 'sunisa.k@tedet.or.th', 'Support Technician', 'Active', null),
  ('วรวุฒิ เพชรดี', 'วเ', 'ฝ่าย IT', 'worawut.p@tedet.or.th', 'Network Engineer', 'Active', null),
  ('สมหญิง วงศ์', 'สว', 'ฝ่ายบัญชี', 'somying.w@tedet.or.th', 'Employee', 'Active', 'Notebook, iPhone'),
  ('กิตติ ชูเกียรติ', 'กช', 'ฝ่ายวิชาการ', 'kittic@tedet.or.th', 'Employee', 'Active', 'PC'),
  ('ปวีณา วิไล', 'ปว', 'ฝ่ายการตลาด', 'paweenaw@tedet.or.th', 'Employee', 'Active', 'Notebook'),
  ('ธนกร ศรีสุข', 'ธน', 'ฝ่ายบริหาร', 'thanakorns@tedet.or.th', 'Employee', 'Active', 'MacBook Pro, iPad'),
  ('อรทัย พงษ์', 'อร', 'ฝ่ายวิชาการ', 'orathaip@tedet.or.th', 'Employee', 'Active', 'PC, Mouse (ส่งซ่อม)'),
  ('มานพ ทองดี', 'มท', 'ฝ่ายบัญชี', 'manopt@tedet.or.th', 'Employee', 'Suspended', 'Notebook'),
  ('จิราพร ศรี', 'จศ', 'ฝ่ายบริหาร', 'jiraporns@tedet.or.th', 'Employee', 'Active', 'PC, Monitor')
on conflict (email) do nothing;

-- ---------- tickets ----------
insert into tickets (ticket_number, subject, category, reporter_id, assignee_id, priority, status, created_at, updated_at)
select v.ticket_number, v.subject, v.category,
       (select id from staff where email = v.reporter_email),
       (select id from staff where email = v.assignee_email),
       v.priority, v.status, now() - v.age, now() - v.age
from (values
  ('TK-2041', 'เครื่องพิมพ์ห้องบัญชีใช้งานไม่ได้', 'Hardware', 'somying.w@tedet.or.th', 'teerapong.j@tedet.or.th', 'high', 'In Progress', interval '10 minutes'),
  ('TK-2040', 'ขอรีเซ็ตรหัสผ่าน VPN', 'Account/Access', 'kittic@tedet.or.th', 'sunisa.k@tedet.or.th', 'medium', 'Open', interval '32 minutes'),
  ('TK-2039', 'อินเทอร์เน็ตชั้น 3 หลุดบ่อย', 'Network', 'paweenaw@tedet.or.th', 'worawut.p@tedet.or.th', 'critical', 'Escalated', interval '1 hour'),
  ('TK-2038', 'ติดตั้งโปรแกรม Adobe', 'Software', 'thanakorns@tedet.or.th', 'teerapong.j@tedet.or.th', 'low', 'Resolved', interval '2 hours'),
  ('TK-2037', 'เมาส์เสีย ขอเปลี่ยนอุปกรณ์', 'Hardware', 'orathaip@tedet.or.th', null, 'low', 'Pending', interval '3 hours'),
  ('TK-2036', 'ขอสิทธิ์เข้าถึงระบบ ERP โมดูลบัญชี', 'Account/Access', 'manopt@tedet.or.th', 'nattanon.k@tedet.or.th', 'medium', 'Open', interval '4 hours'),
  ('TK-2035', 'จอคอมพิวเตอร์กระพริบ ห้องประชุม A', 'Hardware', 'jiraporns@tedet.or.th', 'sunisa.k@tedet.or.th', 'medium', 'In Progress', interval '5 hours'),
  ('TK-2034', 'Wi-Fi แขกใช้งานไม่ได้ ชั้น 1', 'Network', 'jiraporns@tedet.or.th', 'worawut.p@tedet.or.th', 'high', 'Open', interval '6 hours'),
  ('TK-2033', 'ขอ License Microsoft Office เพิ่ม', 'Software', 'somying.w@tedet.or.th', 'nattanon.k@tedet.or.th', 'low', 'Resolved', interval '1 day'),
  ('TK-2032', 'อีเมลไม่สามารถส่งไฟล์แนบขนาดใหญ่ได้', 'Software', 'kittic@tedet.or.th', 'teerapong.j@tedet.or.th', 'medium', 'Resolved', interval '1 day')
) as v(ticket_number, subject, category, reporter_email, assignee_email, priority, status, age)
on conflict (ticket_number) do nothing;

-- ---------- knowledge base ----------
insert into kb_articles (tag, title, description, views, updated_at) values
  ('Software', 'วิธีติดตั้ง VPN Client สำหรับพนักงาน', 'ขั้นตอนติดตั้งและตั้งค่า VPN สำหรับการทำงานนอกสถานที่', 1200, now() - interval '3 days'),
  ('Hardware', 'แก้ปัญหาเครื่องพิมพ์เชื่อมต่อไม่ได้', 'ขั้นตอนตรวจสอบเบื้องต้นก่อนแจ้ง Ticket', 980, now() - interval '7 days'),
  ('Account', 'วิธีขอรีเซ็ตรหัสผ่านด้วยตนเอง', 'Self-service password reset ผ่านระบบ SSO', 2400, now() - interval '2 days'),
  ('Network', 'แก้ปัญหา Wi-Fi หลุดบ่อยในสำนักงาน', 'ขั้นตอนวินิจฉัยปัญหาเครือข่ายไร้สาย', 740, now() - interval '5 days'),
  ('Onboarding', 'คู่มือตั้งค่าอุปกรณ์สำหรับพนักงานใหม่', 'Checklist การเตรียมอุปกรณ์และบัญชีผู้ใช้งาน', 612, now() - interval '14 days'),
  ('Software', 'การขอสิทธิ์ใช้งาน Microsoft 365', 'ขั้นตอนขอ License และการติดตั้งโปรแกรม', 890, now() - interval '4 days');

-- ---------- assets ----------
insert into assets (asset_tag, name, type, holder, status, warranty_until) values
  ('AST-0142', 'Dell Latitude 5440', 'Notebook', 'สมหญิง วงศ์', 'Active', '2026-12-01'),
  ('AST-0098', 'HP LaserJet Pro M404', 'เครื่องพิมพ์', 'ฝ่ายบัญชี (ใช้ร่วม)', 'Repair', '2025-03-01'),
  ('AST-0231', 'Lenovo ThinkCentre M70q', 'PC', 'กิตติ ชูเกียรติ', 'Active', '2027-07-01'),
  ('AST-0305', 'Cisco Catalyst 2960', 'เครือข่าย', 'Server Room', 'Active', '2026-01-01'),
  ('AST-0410', 'Microsoft 365 Business — License', 'License', 'องค์กร (450 seats)', 'Active', null),
  ('AST-0056', 'MacBook Pro 14"', 'Notebook', 'ธนกร ศรีสุข', 'Active', '2025-09-01'),
  ('AST-0289', 'Epson EB-X06 Projector', 'อื่นๆ', 'ห้องประชุม A', 'Retired', null),
  ('AST-0177', 'Synology NAS DS920+', 'เครือข่าย', 'Server Room', 'Active', '2026-05-01')
on conflict (asset_tag) do nothing;

-- ---------- websites ----------
insert into websites (name, url, tech_stack, hosting, status, ssl_status, uptime_pct, owner_id, last_checked_at)
select v.name, v.url, v.tech_stack, v.hosting, v.status, v.ssl_status, v.uptime_pct,
       (select id from staff where email = v.owner_email), now() - v.age
from (values
  ('เว็บไซต์หลักองค์กร', 'www.example-corp.or.th', 'ASP Classic + IIS', 'On-Premise Server', 'Online', 'Valid', 99.95, 'nattanon.k@tedet.or.th', interval '5 minutes'),
  ('ระบบสมัครสอบออนไลน์', 'exam.example-corp.or.th', 'PHP (Laravel)', 'Cloud VPS', 'Online', 'Valid', 99.80, 'teerapong.j@tedet.or.th', interval '5 minutes'),
  ('ระบบ E-Learning (LMS)', 'learn.example-corp.or.th', 'WordPress + LearnDash', 'Shared Hosting', 'Online', 'Valid', 99.60, 'sunisa.k@tedet.or.th', interval '10 minutes'),
  ('เว็บลงทะเบียนกิจกรรม', 'event.example-corp.or.th', 'Next.js (React)', 'Vercel', 'Online', 'Valid', 99.99, 'worawut.p@tedet.or.th', interval '5 minutes'),
  ('พอร์ทัลโรงเรียนพันธมิตร', 'school-portal.example-corp.or.th', 'PHP (CodeIgniter)', 'Cloud VPS', 'Maintenance', 'Valid', 98.20, 'teerapong.j@tedet.or.th', interval '1 hour'),
  ('อินทราเน็ตฝ่ายบุคคล', 'hr-intranet.local', 'ASP.NET', 'On-Premise Server', 'Online', 'Internal Only', 99.90, 'nattanon.k@tedet.or.th', interval '15 minutes'),
  ('เว็บไซต์ศิษย์เก่า', 'alumni.example-corp.or.th', 'WordPress', 'Shared Hosting', 'Online', 'Expiring Soon', 99.40, 'sunisa.k@tedet.or.th', interval '20 minutes'),
  ('ไมโครไซต์ประกาศผลรางวัล', 'award.example-corp.or.th', 'Static HTML/CSS', 'Cloud Storage', 'Online', 'Valid', 100.00, 'worawut.p@tedet.or.th', interval '5 minutes'),
  ('ร้านค้าออนไลน์ (สื่อการเรียน)', 'shop.example-corp.or.th', 'WooCommerce (WordPress)', 'Cloud VPS', 'Degraded', 'Valid', 97.10, 'teerapong.j@tedet.or.th', interval '2 minutes'),
  ('เว็บไซต์เก่า (Archive)', 'old.example-corp.or.th', 'ASP Classic', 'On-Premise Server', 'Offline', 'Expired', null, null, interval '3 days')
) as v(name, url, tech_stack, hosting, status, ssl_status, uptime_pct, owner_email, age);

-- ---------- backup jobs ----------
insert into backup_jobs (job_name, job_type, size_label, started_at, duration_label, status) values
  ('Nightly — File Server', 'Incremental', '142 GB', now() - interval '10 hours', '38 นาที', 'Failed'),
  ('Nightly — Database (ERP)', 'Full', '64 GB', now() - interval '10 hours 30 minutes', '22 นาที', 'Success'),
  ('Weekly — Mail Server', 'Full', '310 GB', now() - interval '1 day', '1 ชม. 45 นาที', 'Success'),
  ('Nightly — Website (tedet.or.th)', 'Incremental', '8 GB', now() - interval '9 hours', '6 นาที', 'Success'),
  ('Nightly — User Workstations', 'Incremental', '1.2 TB', now() - interval '8 hours', '2 ชม. 10 นาที', 'Success');
