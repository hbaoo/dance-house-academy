-- DUMMY DATA FOR DANCE HOUSE CRM
-- Run this in Supabase SQL Editor to populate your dashboard

-- 1. Insert Dummy Students
INSERT INTO public.students (full_name, email, phone, status, join_date)
VALUES 
('Nguyễn Văn An', 'an.nguyen@example.com', '0901234567', 'Active', NOW() - INTERVAL '2 months'),
('Trần Thị Bình', 'binh.tran@example.com', '0902345678', 'Active', NOW() - INTERVAL '1 month'),
('Lê Hoàng Cúc', 'cuc.le@example.com', '0903456789', 'Active', NOW() - INTERVAL '15 days'),
('Phạm Minh Duy', 'duy.pham@example.com', '0904567890', 'Active', NOW() - INTERVAL '3 days'),
('Hoàng Mai Em', 'em.hoang@example.com', '0905678901', 'Inactive', NOW() - INTERVAL '6 months');

-- 2. Insert Dummy Classes
INSERT INTO public.classes (title, time, duration, studio, age_range, instructor, price)
VALUES
('Ballet Cơ Bản Sáng 2-4-6', '08:00', '60 MIN', 'Studio A', 'Adult', '{"name": "Cô Thúy"}', 1500000),
('Ballet Nâng Cao Chiều 3-5-7', '17:30', '90 MIN', 'Studio B', 'Adult', '{"name": "Thầy Nam"}', 2000000),
('Kids Ballet Cuối Tuần', '09:00', '45 MIN', 'Studio A', 'Kids', '{"name": "Cô Lan"}', 1200000);

-- 3. Insert Dummy Memberships (Active & Expiring)
-- Link to first 3 students we just created (using subquery to get IDs)
-- Student 1: Active, long term
INSERT INTO public.memberships (student_id, package_name, total_sessions, remaining_sessions, start_date, end_date, status)
SELECT id, 'Gói 3 Tháng', 36, 30, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', 'Active'
FROM public.students WHERE email = 'an.nguyen@example.com';

-- Student 2: Active, EXPIRING SOON (in 5 days)
INSERT INTO public.memberships (student_id, package_name, total_sessions, remaining_sessions, start_date, end_date, status)
SELECT id, 'Gói 1 Tháng', 12, 2, NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', 'Active'
FROM public.students WHERE email = 'binh.tran@example.com';

-- Student 3: Active, EXPIRING TOMORROW
INSERT INTO public.memberships (student_id, package_name, total_sessions, remaining_sessions, start_date, end_date, status)
SELECT id, 'Gói Trải Nghiệm', 5, 1, NOW() - INTERVAL '1 month', NOW() + INTERVAL '1 day', 'Active'
FROM public.students WHERE email = 'cuc.le@example.com';

-- 4. Insert Dummy Transactions (Revenue)
-- NOTE: Removed 'type' and 'method' as they might not be in your specific schema version, matching core fields only.
-- Past transactions
INSERT INTO public.transactions (student_id, amount, status, created_at, order_code, customer_name, customer_phone)
SELECT id, 4500000, 'completed', NOW() - INTERVAL '1 month', 'TXN-001', 'Nguyễn Văn An', '0901234567'
FROM public.students WHERE email = 'an.nguyen@example.com';

INSERT INTO public.transactions (student_id, amount, status, created_at, order_code, customer_name, customer_phone)
SELECT id, 1500000, 'completed', NOW() - INTERVAL '25 days', 'TXN-002', 'Trần Thị Bình', '0902345678'
FROM public.students WHERE email = 'binh.tran@example.com';

-- Current month transactions
INSERT INTO public.transactions (student_id, amount, status, created_at, order_code, customer_name, customer_phone)
SELECT id, 800000, 'completed', NOW() - INTERVAL '2 days', 'TXN-003', 'Phạm Minh Duy', '0904567890'
FROM public.students WHERE email = 'duy.pham@example.com';

-- 5. Insert Dummy Orders (Store Revenue)
INSERT INTO public.orders (customer_name, customer_email, item_name, amount, status, order_code, created_at)
VALUES
('Khách Vãng Lai 1', 'guest1@test.com', 'Giày Múa', 450000, 'Completed', 'ORD-001', NOW() - INTERVAL '2 days'),
('Khách Vãng Lai 2', 'guest2@test.com', 'Váy Tutu', 1200000, 'Pending', 'ORD-002', NOW());

-- 6. Insert Dummy Trial Bookings (Leads)
INSERT INTO public.trial_bookings (full_name, phone, class_interest, status, created_at)
VALUES
('Nguyễn Thị Tiềm Năng', '0987654321', 'Ballet Cơ Bản', 'Pending', NOW()),
('Trần Văn Chốt', '0912345678', 'Kids Ballet', 'Contacted', NOW() - INTERVAL '1 day');

-- 7. Insert Dummy Attendance (Today)
INSERT INTO public.attendance (student_id, class_id, date, status)
SELECT s.id, c.id, CURRENT_DATE, 'Present'
FROM public.students s, public.classes c
WHERE s.email = 'an.nguyen@example.com' AND c.title LIKE '%Sáng%'
LIMIT 1;
