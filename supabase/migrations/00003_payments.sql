CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'stripe',
    external_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'rub',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_lead_id ON payments (lead_id);
CREATE INDEX idx_payments_external_id ON payments (external_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own payments"
ON payments FOR SELECT
USING (
    lead_id IN (
        SELECT id FROM leads
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
        )
    )
);

CREATE POLICY "Admins full access payments"
ON payments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE telegram_id = current_setting('app.current_telegram_id', true)::bigint
          AND role = 'admin'
    )
);

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();