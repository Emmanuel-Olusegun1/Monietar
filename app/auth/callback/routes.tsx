// // app/auth/callback/route.ts
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get('code');

//   if (code) {
//     const supabase = createRouteHandlerClient({ cookies });
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   return NextResponse.redirect(requestUrl.origin + '/dashboard');
// }


// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase'; // Adjust if you have types

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      // Create a Supabase client with the auth helpers
      const supabase = createRouteHandlerClient<Database>({ 
        cookies 
      });

      // This exchanges the one-time code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to signin with error
        return NextResponse.redirect(
          new URL('/auth/signin?error=oauth_failed', requestUrl.origin)
        );
      }
    } catch (error) {
      console.error('Unexpected error in callback:', error);
      return NextResponse.redirect(
        new URL('/auth/signin?error=unexpected', requestUrl.origin)
      );
    }
  }

  // Successful authentication - redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}