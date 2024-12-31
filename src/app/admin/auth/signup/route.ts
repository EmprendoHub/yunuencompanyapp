import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const cookieStore = await cookies();

  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${url.origin}/admin/auth/callback`,
    },
  });

  return NextResponse.redirect(url.origin, {
    status: 301,
  });
}
