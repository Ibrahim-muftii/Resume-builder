# Database

This project uses Supabase Postgres with five primary tables and strict row-level security.

## Tables

### profiles

Stores user profile information created automatically when a Supabase auth user is created.

Columns:

- id uuid primary key, references auth.users(id)
- full_name text
- avatar_url text
- first_name text
- last_name text
- created_at timestamp with time zone
- updated_at timestamp with time zone

### resumes

Stores each resume owned by a user.

Columns:

- id uuid primary key
- user_id uuid, references profiles(id)
- title text
- template_id text
- is_public boolean
- last_edited_at timestamp with time zone
- created_at timestamp with time zone
- updated_at timestamp with time zone

### resume_sections

Stores the ordered sections that belong to a resume.

Columns:

- id uuid primary key
- resume_id uuid, references resumes(id)
- type text
- title text
- position integer
- is_visible boolean
- created_at timestamp with time zone
- updated_at timestamp with time zone

### section_items

Stores the entries inside each section.

Columns:

- id uuid primary key
- section_id uuid, references resume_sections(id)
- position integer
- data jsonb
- created_at timestamp with time zone
- updated_at timestamp with time zone

### templates

Stores the built-in resume templates.

Columns:

- id text primary key
- name text
- description text
- thumbnail_url text
- is_premium boolean
- category text

## JSONB Data Column

The section_items.data column stores structured section content as JSONB. The application uses a discriminated union pattern with a type field on every section payload. That lets the app validate the data shape at runtime with Zod while keeping strong TypeScript types for each section kind.

Each item payload looks like a typed object such as personal_info, experience, education, skills, projects, certifications, languages, or custom. The type field determines which schema applies.

## Row-Level Security

### profiles

- Select: any authenticated or unauthenticated user can read public profile rows.
- Insert: only the authenticated user whose id matches the row can insert.
- Update: only the profile owner can update.
- Delete: only the profile owner can delete.

### resumes

- Select: users can read their own resumes, and public resumes are readable by everyone.
- Insert: only the authenticated owner can insert.
- Update: only the owner can update.
- Delete: only the owner can delete.

### resume_sections

- Select: allowed when the parent resume belongs to the current user or is public.
- Insert: allowed only for sections that belong to a resume owned by the current user.
- Update: allowed only for sections on the user’s own resumes.
- Delete: allowed only for sections on the user’s own resumes.

### section_items

- Select: allowed when the parent section belongs to an accessible resume.
- Insert: allowed only for items on the current user’s own resumes.
- Update: allowed only for items on the current user’s own resumes.
- Delete: allowed only for items on the current user’s own resumes.

### templates

- Select: publicly readable.

## Triggers

### handle_new_user

Runs after a new auth user is created. It inserts a matching row into profiles and copies metadata such as full_name, first_name, last_name, and avatar_url.

### update_updated_at

Runs before updates on resumes, resume_sections, and section_items. It sets updated_at to the current timestamp.

## Migrations

- Local: supabase db reset
- Production: supabase db push

## Type Generation

Generate TypeScript database types with:

supabase gen types typescript --local > src/types/database.types.ts

For a hosted project, replace --local with your project reference and output path as needed.