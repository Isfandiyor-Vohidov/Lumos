-- RLS: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own profile"
ON profiles FOR SELECT
USING (telegram_id = current_setting('app.current_telegram_id', true)::bigint);

CREATE POLICY "Admins read all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.telegram_id = current_setting('app.current_telegram_id', true)::bigint
    AND p.role = 'admin'
  )
);

-- RLS: courses (readable by all authenticated)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active courses"
ON courses FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins full access to courses"
ON courses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
      AND role = 'admin'
  )
);

-- RLS: questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
ON questions FOR SELECT
USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = questions.course_id AND courses.is_active = true)
);

CREATE POLICY "Admins full access to questions"
ON questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
      AND role = 'admin'
  )
);

-- RLS: leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own leads"
ON leads FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles
    WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
  )
);

CREATE POLICY "Students insert own leads"
ON leads FOR INSERT
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles
    WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
  )
);

CREATE POLICY "Admins full access to leads"
ON leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
      AND role = 'admin'
  )
);