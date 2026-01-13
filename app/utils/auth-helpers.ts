// utils/auth-helpers.ts
import { supabase } from './supabase/client'

export async function checkUserExists(email: string): Promise<{
  exists: boolean;
  hasCompletedProfile: boolean;
  userData?: any;
}> {
  try {
    // Try to get user by email from Supabase
    const { data, error } = await supabase
      .from('profiles') // Assuming you have a profiles table
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user existence:', error)
      return { exists: false, hasCompletedProfile: false }
    }
    
    if (data) {
      // Check if user has completed profile
      const hasCompletedProfile = !!(data.business_name && data.full_name)
      return { 
        exists: true, 
        hasCompletedProfile,
        userData: data 
      }
    }
    
    return { exists: false, hasCompletedProfile: false }
    
  } catch (error) {
    console.error('Error in checkUserExists:', error)
    return { exists: false, hasCompletedProfile: false }
  }
}

// Alternative: Check via auth API if profiles table doesn't exist
export async function checkUserExistsViaAuth(email: string): Promise<{
  exists: boolean;
  hasCompletedProfile: boolean;
}> {
  try {
    // Try to sign in with password to check if user exists
    // This is a dummy attempt to check existence
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy_password_for_check'
    })
    
    // If error is not "invalid credentials", something else is wrong
    if (error) {
      if (error.message.includes('Invalid login credentials') || 
          error.message.includes('User not found')) {
        return { exists: false, hasCompletedProfile: false }
      }
      console.error('Error checking user:', error)
      return { exists: false, hasCompletedProfile: false }
    }
    
    // If we get here, user exists (but this is unlikely with dummy password)
    // Get the actual user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const userMeta = session.user.user_metadata || {}
      const hasCompletedProfile = !!(userMeta.business_name && userMeta.name)
      return { 
        exists: true, 
        hasCompletedProfile 
      }
    }
    
    return { exists: false, hasCompletedProfile: false }
    
  } catch (error) {
    console.error('Error in checkUserExistsViaAuth:', error)
    return { exists: false, hasCompletedProfile: false }
  }
}