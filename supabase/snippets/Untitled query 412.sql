INSERT INTO templates (id, name, description, category, is_premium)
VALUES (
  'professional', 
  'Professional', 
  'A sharp, high-contrast replica of the Ibrahim Mufti resume style. Perfect for developers and designers.', 
  'Professional', 
  false
) ON CONFLICT (id) DO NOTHING;