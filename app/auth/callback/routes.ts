// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, requestUrl.searchParams.get('error_description'))
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  // If we have an authorization code, exchange it for a session
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      
      // This is the critical line - exchanges the code for a session
      const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) {
        console.error('Error exchanging code:', authError)
        return NextResponse.redirect(
          new URL('/auth/signin?error=auth_failed', requestUrl.origin)
        )
      }
      
      // Get the session to verify it was created
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session created after exchange')
        return NextResponse.redirect(
          new URL('/auth/signin?error=no_session', requestUrl.origin)
        )
      }
      
      console.log('✅ Google OAuth successful for user:', session.user.email)
      
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
      
    } catch (error: any) {
      console.error('Unexpected error in callback:', error)
      return NextResponse.redirect(
        new URL('/auth/signin?error=unexpected', requestUrl.origin)
      )
    }
  }

  // If no code or error, redirect to signin
  console.warn('No OAuth code received in callback')
  return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
}

export const dynamic = 'force-dynamic'