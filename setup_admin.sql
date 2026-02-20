-- Grant Admin Privileges to rakesh@company.com
-- Run this script AFTER signing up through the application

-- Step 1: Update the user's role to admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'rakesh@company.com';

-- Step 2: Assign the admin role
INSERT INTO user_roles (user_id, role_id)
SELECT
  p.id as user_id,
  r.id as role_id
FROM profiles p
CROSS JOIN roles r
WHERE p.email = 'rakesh@company.com'
  AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 3: Initialize security settings
INSERT INTO security_settings (user_id, two_factor_enabled, login_notifications, api_rate_limit)
SELECT
  id,
  false,
  true,
  10000
FROM profiles
WHERE email = 'rakesh@company.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Verify the setup
SELECT
  p.email,
  p.role,
  p.balance,
  p.created_at,
  CASE WHEN ur.role_id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_admin_role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id AND r.name = 'admin'
WHERE p.email = 'rakesh@company.com';
