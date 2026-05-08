CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'finished', 'abandoned')),
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_test_sessions_profile_course ON test_sessions (profile_id, course_id);
CREATE INDEX idx_test_sessions_status ON test_sessions (status);

ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own test sessions"
ON test_sessions FOR ALL
USING (
    profile_id IN (
        SELECT id FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
    )
);

CREATE POLICY "Admins read test sessions of their center"
ON test_sessions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles admin
        WHERE admin.telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND admin.role = 'admin'
          AND (
              admin.center_id IS NULL
              OR admin.center_id = (
                  SELECT p.center_id FROM profiles p WHERE p.id = test_sessions.profile_id
              )
          )
    )
);