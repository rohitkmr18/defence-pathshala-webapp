-- Production hotfix (2026-11-10): reconcile the onboarding RPC with the
-- frontend's AFCAT checkbox and POST /api/onboarding validator.
-- The equivalent change was already applied to production through the
-- Supabase migration 'allow_afcat_in_production_onboarding'.
-- This migration is deliberately idempotent for production and applies
-- the same guarded correction to other environments on replay.
-- No user rows, auth policies or permissions are changed.

DO $patch$
DECLARE
  original_definition text;
  old_rule constant text := '(p_setup and not p_target_exams <@ array[''CDS'', ''CAPF-AC'']::text[])';
  new_rule constant text := '(p_setup and not p_target_exams <@ array[''CDS'', ''CAPF-AC'', ''AFCAT'']::text[])';
BEGIN
  original_definition := pg_get_functiondef(
    'dp_onboarding_private.save_preparation_profile(text,integer,text[],boolean)'::regprocedure
  );
  IF original_definition IS NULL THEN
    RAISE EXCEPTION 'Missing onboarding function; refusing automatic patch';
  END IF;
  IF position(new_rule IN original_definition) > 0
     AND position(old_rule IN original_definition) = 0 THEN
    RETURN;
  END IF;
  IF length(original_definition) - length(replace(original_definition, old_rule, '')) <> length(old_rule) THEN
    RAISE EXCEPTION 'Unexpected onboarding function version; refusing automatic patch';
  END IF;
  EXECUTE replace(original_definition, old_rule, new_rule);
END $patch$;

NOTIFY pgrst, 'reload schema';
