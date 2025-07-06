// src/utils/supabase/server.ts

import { createServerClient} from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies(); // ✅ Always get it inside the function

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = (await cookieStore).get(name);
          return cookie?.value ?? undefined; // ✅ No error
        },
        set: () => {}, // No-op in server context
        remove: () => {}, // No-op in server context
      },
    }
  );
};
