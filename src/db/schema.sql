CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (
    stage IN ('applied', 'phone_screen', 'technical', 'onsite', 'offer', 'rejected', 'withdrawn')
  ),
  applied_date DATE NOT NULL,
  next_step_date DATE,
  link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications (stage);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications (company);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
