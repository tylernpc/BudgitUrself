// app/api/health/db/route.ts
import {createClient} from "@supabase/supabase-js";

async function InstrumentData() {
    const supabase = await createClient();
}