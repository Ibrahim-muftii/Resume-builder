# Deployment

## Deploy to Vercel

1. Create a Supabase project at supabase.com.
2. Run migrations on the cloud database: supabase link then supabase db push.
3. Copy the cloud Supabase URL and anon key.
4. Push the repo to GitHub.
5. Import the repository into Vercel.
6. Add all environment variables in the Vercel dashboard.
7. Deploy.

## Environment Variables

| Variable | Description |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL used by the browser client. |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key used by the browser client. |
| SUPABASE_SERVICE_ROLE_KEY | Service role key for server-side administrative access. |
| NEXT_PUBLIC_APP_URL | Public application URL used in redirects and callbacks. |

## Post-Deployment Checklist

- Verify login and sign up flows.
- Confirm resume creation and editing work in production.
- Test autosave and manual save recovery.
- Check PDF export in the browser.
- Confirm public/private resume visibility behaves as expected.
- Validate that environment variables were added to Vercel correctly.