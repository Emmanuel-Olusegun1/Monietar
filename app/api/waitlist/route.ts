import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple server-side email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize Supabase Client using backend service-role credentials to bypass client RLS rules safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: Request) {
  try {
    // 1. Structural environment configuration checks
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Configuration Error] Missing Supabase Environment credentials.');
      return NextResponse.json(
        { message: 'Server infrastructure configuration error.' },
        { status: 500 }
      );
    }

    // 2. Parse payload request parameters
    const body = await request.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email address is required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email format.' }, { status: 400 });
    }

    // 3. Database Insertion Action
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert([
        { 
          email: email.trim().toLowerCase(), 
          source: source || 'unknown' 
        }
      ]);

    if (dbError) {
      // Handle Postgres unique constraint violation (Error Code 23505 means email already registered)
      if (dbError.code === '23505') {
        return NextResponse.json(
          { message: 'This business email is already secured on our priority waitlist!' },
          { status: 409 }
        );
      }
      throw dbError;
    }

    // 4. Return successful operational tracking state response
    return NextResponse.json(
      { success: true, message: 'Position secured inside the pioneer cohort.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[Supabase Waitlist Sync Exception]:', error);
    return NextResponse.json(
      { message: 'An internal error occurred while saving your record. Please try again.' },
      { status: 500 }
    );
  }
}