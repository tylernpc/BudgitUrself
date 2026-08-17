-- The app has no Supabase client (auth is Auth0, and "User" is only ever
-- read/written by Prisma over the direct Postgres connection), so this
-- table has no legitimate PostgREST use. RLS is enabled with no policies
-- to block all access through Supabase's auto-generated REST/GraphQL API.
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
