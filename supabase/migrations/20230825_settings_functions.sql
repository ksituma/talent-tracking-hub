
-- Create function to check if settings already exist
CREATE OR REPLACE FUNCTION public.check_settings_exist()
RETURNS boolean
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.settings LIMIT 1
  );
$$;

-- Create function to get settings
CREATE OR REPLACE FUNCTION public.get_settings()
RETURNS public.settings
LANGUAGE sql
AS $$
  SELECT * FROM public.settings LIMIT 1;
$$;

-- Create function to update settings
CREATE OR REPLACE FUNCTION public.update_settings(
  company_name text,
  system_email text,
  timezone text,
  date_format text,
  email_notifications boolean,
  new_application_alerts boolean,
  job_posting_expiry_alerts boolean,
  min_years_experience integer,
  min_qualification text,
  skill_match_threshold integer,
  automatic_shortlisting boolean,
  updated_at timestamp with time zone
)
RETURNS public.settings
LANGUAGE plpgsql
AS $$
DECLARE
  settings_record public.settings;
BEGIN
  UPDATE public.settings
  SET 
    company_name = $1,
    system_email = $2,
    timezone = $3,
    date_format = $4,
    email_notifications = $5,
    new_application_alerts = $6,
    job_posting_expiry_alerts = $7,
    min_years_experience = $8,
    min_qualification = $9,
    skill_match_threshold = $10,
    automatic_shortlisting = $11,
    updated_at = $12
  WHERE id = (SELECT id FROM public.settings LIMIT 1)
  RETURNING * INTO settings_record;
  
  RETURN settings_record;
END;
$$;

-- Create function to create settings
CREATE OR REPLACE FUNCTION public.create_settings(
  company_name text,
  system_email text,
  timezone text,
  date_format text,
  email_notifications boolean,
  new_application_alerts boolean,
  job_posting_expiry_alerts boolean,
  min_years_experience integer,
  min_qualification text,
  skill_match_threshold integer,
  automatic_shortlisting boolean,
  updated_at timestamp with time zone
)
RETURNS public.settings
LANGUAGE plpgsql
AS $$
DECLARE
  settings_record public.settings;
BEGIN
  INSERT INTO public.settings (
    company_name,
    system_email,
    timezone,
    date_format,
    email_notifications,
    new_application_alerts,
    job_posting_expiry_alerts,
    min_years_experience,
    min_qualification,
    skill_match_threshold,
    automatic_shortlisting,
    updated_at
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  )
  RETURNING * INTO settings_record;
  
  RETURN settings_record;
END;
$$;
