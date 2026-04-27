INSERT INTO templates (id, name, description, category, is_premium, thumbnail_url)
VALUES ('london', 'London', 'A high-impact, professional template featuring a centered header, full-width horizontal rules, and a traditional clean layout.', 'Professional', false, NULL)
ON CONFLICT (id) DO NOTHING;