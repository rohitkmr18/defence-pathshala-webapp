-- Add remaining onboarding columns

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS target_year INTEGER,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;