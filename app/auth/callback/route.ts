// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🔐 OAuth callback handler triggered');
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const source = requestUrl.searchParams.get('source') || 'signin'
  
  console.log('Callback params:', { 
    code: code ? 'YES' : 'NO', 
    error, 
    next, 
    source 
  })

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(
      new URL(`/auth/${source}?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  // If we have an authorization code
  if (code) {
    try {
      console.log('Creating Supabase client...')
      const supabase = createRouteHandlerClient({ cookies })
      
      console.log('Exchanging code for session...')
      const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) {
        console.error('Error exchanging code:', authError.message)
        return NextResponse.redirect(
          new URL(`/auth/${source}?error=${encodeURIComponent(authError.message)}`, requestUrl.origin)
        )
      }
      
      console.log('Code exchange successful, checking session...')
      
      // Get the session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session created')
        return NextResponse.redirect(
          new URL(`/auth/${source}?error=no_session`, requestUrl.origin)
        )
      }
      
      console.log('✅ OAuth successful for user:', session.user.email)
      
      // Get user metadata
      const userMeta = session.user.user_metadata || {}
      const hasBusinessName = !!userMeta.business_name
      const hasName = !!userMeta.name
      const isProfileComplete = hasBusinessName && hasName
      
      // Check if this is a new user (no profile data)
      const isNewUser = !hasBusinessName && !hasName
      
      // Determine where to redirect based on user status and source
      let redirectPath = next
      
      if (isNewUser) {
        // New user regardless of source (signin or signup)
        console.log('New user detected, redirecting to complete profile')
        redirectPath = '/auth/complete-profile'
      } else if (!isProfileComplete) {
        // Returning user with incomplete profile
        console.log('Returning user with incomplete profile')
        if (source === 'signup') {
          redirectPath = '/auth/complete-profile'
        } else {
          redirectPath = next // Allow signin even with incomplete profile
        }
      } else {
        // User with complete profile
        console.log('User with complete profile, redirecting to:', next)
        redirectPath = next
      }
      
      console.log('Final redirect to:', redirectPath)
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
      
    } catch (error: any) {
      console.error('Unexpected error:', error)
      return NextResponse.redirect(
        new URL(`/auth/${source}?error=${encodeURIComponent(error.message || 'unexpected')}`, requestUrl.origin)
      )
    }
  }

  console.warn('No OAuth code received')
  return NextResponse.redirect(new URL(`/auth/${source}`, requestUrl.origin))
}

export const dynamic = 'force-dynamic'