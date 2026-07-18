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

  // Refresh the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const isAuthRoute = pathname.startsWith('/auth');

  // Protect dashboard routes
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(
      new URL('/auth/signin', request.url)
    );
  }

  // Prevent logged-in users from visiting auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL('/dashboard/overview', request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run middleware on everything except:
     * - api routes
     * - next static files
     * - images
     * - favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};