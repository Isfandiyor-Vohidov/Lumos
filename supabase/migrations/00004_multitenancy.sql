-- Уточняем политики: админ центра видит только данные своего центра

-- leads
DROP POLICY IF EXISTS "Admins full access to leads" ON leads;
CREATE POLICY "Admins full access to leads"
ON leads FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND role = 'admin'
          AND (
              center_id IS NULL
              OR center_id = leads.center_id
          )
    )
);

-- courses
DROP POLICY IF EXISTS "Admins full access to courses" ON courses;
CREATE POLICY "Admins full access to courses"
ON courses FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND role = 'admin'
          AND (
              center_id IS NULL
              OR center_id = courses.center_id
          )
    )
);

-- questions (через курс)
DROP POLICY IF EXISTS "Admins full access to questions" ON questions;
CREATE POLICY "Admins full access to questions"
ON questions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND role = 'admin'
          AND (
              center_id IS NULL
              OR center_id = (
                  SELECT c.center_id FROM courses c WHERE c.id = questions.course_id
              )
          )
    )
);

-- payments (через лид)
DROP POLICY IF EXISTS "Admins full access payments" ON payments;
CREATE POLICY "Admins full access payments"
ON payments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND role = 'admin'
          AND (
              center_id IS NULL
              OR center_id = (
                  SELECT l.center_id FROM leads l WHERE l.id = payments.lead_id
              )
          )
    )
);