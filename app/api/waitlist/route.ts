import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Simple server-side email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // 1. Core Environment Configuration Checks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      console.error('[Configuration Error] Missing structural environment credentials.');
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

    const cleanEmail = email.trim().toLowerCase();

    // 3. Initialize Clients Safely within Request Context
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const resend = new Resend(resendApiKey);

    // 4. Database Insertion Action
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert([{ email: cleanEmail, source: source || 'unknown' }]);

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

    // 5. Transactional Trigger: Shoot Welcome Email instantly
    try {
      await resend.emails.send({
        from: 'Monietar <welcome@monietar.com.ng>',
        to: cleanEmail,
        subject: 'Your priority spot is locked inside Monietar ⚡',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; color: #334155;">
            <h2 style="color: #059669; font-weight: 900; font-size: 24px; margin-bottom: 16px;">Welcome to the Pioneer Cohort!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">
              Thank you for anchoring your interest in <strong>Monietar</strong>. We have successfully secured your position in our early-bird cohort.
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 24px 0;">
              <p style="margin: 0; font-size: 13px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Incentive Active Parameter</p>
              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #0f172a;">🎁 6-Month 50% Early Token Discount Locked</p>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
              We are working hard behind the scenes to roll out the automated alert listening engine. We'll reach out to your inbox the second your dashboard channel is ready to launch.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="font-size: 11px; text-align: center; color: #94a3b8; font-weight: 500;">
              Monietar • Built with precision for scaling African SMEs
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Caught silently so the client interface doesn't crash if the row committed successfully
      console.error('[Resend Operational Dispatch Error]:', emailError);
    }

    // 6. Return successful operational tracking state response
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