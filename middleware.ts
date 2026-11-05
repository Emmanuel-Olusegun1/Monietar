import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },

        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name: string, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Read the session from the request cookie without making another auth API
  // request during navigation.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isDashboardRoute =
    pathname.startsWith('/dashboard/overview') ||
    pathname.startsWith('/dashboard/transactions') ||
    pathname.startsWith('/dashboard/analytics') ||
    pathname.startsWith('/dashboard/dual-currency-ledger') ||
    pathname.startsWith('/dashboard/inventory-tracking') ||
    pathname.startsWith('/dashboard/statements') ||
    pathname.startsWith('/dashboard/profit-loss') ||
    pathname.startsWith('/dashboard/settings') ||
    pathname.startsWith('/dashboard/help');

  // Protect dashboard routes
  if (isDashboardRoute && !session) {
    return NextResponse.redirect(
      new URL('/auth/signin', request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};