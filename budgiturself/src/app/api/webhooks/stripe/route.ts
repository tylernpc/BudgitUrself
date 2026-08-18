import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Stripe delivers webhooks over POST with a signature header. The handler owns
 * the HTTP contract only; signature verification and fulfilment belong in a
 * `lib/integrations/stripe.ts` module once billing is wired up.
 */
export function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
