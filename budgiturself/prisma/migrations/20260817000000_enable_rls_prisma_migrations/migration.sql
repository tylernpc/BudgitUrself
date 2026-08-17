-- Supabase's linter flags any public-schema table without Row Level Security
-- as exposed through the auto-generated PostgREST API. _prisma_migrations is
-- Prisma's internal migration-tracking table and has no legitimate client
-- use, so RLS is enabled with no policies to block all PostgREST access.
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
