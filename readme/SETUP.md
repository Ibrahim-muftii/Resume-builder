# Setup

## Prerequisites

- Node.js 20 or later
- Docker Desktop
- Supabase CLI
- Git

## Local Setup

1. Clone the repo.
2. Install dependencies: npm install
3. Copy .env.local.example to .env.local and fill in values.
4. Start Docker Desktop.
5. Run: supabase start
6. Run the migration: supabase db reset
7. Copy the local anon key and URL from the supabase start output into .env.local.
8. Run: npm run dev
9. Visit http://localhost:3000

## Common Issues

### Docker is not running

Supabase local development requires Docker Desktop. If supabase start fails, make sure Docker Desktop is open and fully initialized before trying again.

### Port conflicts

If another app is already using a Supabase or Next.js port, stop the conflicting process or adjust the local ports before restarting the stack.