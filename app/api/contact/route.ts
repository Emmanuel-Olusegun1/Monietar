import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS = new Set([
  'general',
  'account',
  'partnership',
  'integration',
  'press',
]);

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] || character
  );

const getRequiredText = (value: unknown, field: string, maxLength: number) => {
  if (typeof value !== 'string') {
    throw new Error(`${field} is required.`);
  }

  const cleanedValue = value.trim();
  if (!cleanedValue) {
    throw new Error(`${field} is required.`);
  }

  if (cleanedValue.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return cleanedValue;
};

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      console.error('[Contact Configuration Error] Required server credentials are missing.');
      return NextResponse.json(
        { message: 'Contact submissions are temporarily unavailable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const firstName = getRequiredText(body.firstName, 'First name', 80);
    const lastName = getRequiredText(body.lastName, 'Last name', 80);
    const email = getRequiredText(body.email, 'Email address', 254).toLowerCase();
    const subject = getRequiredText(body.subject, 'Subject', 30);
    const message = getRequiredText(body.message, 'Message', 5000);

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!SUBJECTS.has(subject)) {
      return NextResponse.json({ message: 'Please select a valid subject.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const fullName = `${firstName} ${lastName}`;
    const subjectLabel =
      {
        general: 'General inquiry',
        account: 'Account & product support',
        partnership: 'Partnership',
        integration: 'Integration',
        press: 'Press & media',
      }[subject] || subject;

    const { error: databaseError } = await supabase.from('contact_messages').insert({
      name: fullName,
      email,
      subject: subjectLabel,
      message,
      status: 'unread',
    });

    if (databaseError) {
      console.error('[Contact Database Error]:', databaseError);
      return NextResponse.json(
        { message: 'We could not save your message. Please try again.' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subjectLabel);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const logoUrl =
      'https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png';
    const emailHeader = `
      <div style="padding:30px 32px 24px;text-align:left;background:#111111;">
        <a href="https://monietar.com.ng" style="display:inline-block;text-decoration:none;">
          <img src="${logoUrl}" width="176" alt="Monietar" style="display:block;width:176px;height:auto;border:0;" />
        </a>
      </div>
    `;
    const emailFooter = `
      <div style="border-top:1px solid #374151;margin-top:36px;padding:24px 0 0;text-align:left;">
        <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">Monietar</p>
        <p style="margin:7px 0 0;color:#9ca3af;font-size:11px;line-height:1.7;">
          Better financial visibility for growing businesses.<br />
          <a href="https://monietar.com.ng" style="color:#6ee7b7;text-decoration:none;">monietar.com.ng</a>
        </p>
        <p style="margin:18px 0 0;font-size:11px;">
          <a href="https://monietar.com.ng/about" style="color:#9ca3af;text-decoration:none;">About</a>
          <span style="color:#4b5563;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a href="https://monietar.com.ng/journal" style="color:#9ca3af;text-decoration:none;">Journal</a>
          <span style="color:#4b5563;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a href="https://monietar.com.ng/terms" style="color:#9ca3af;text-decoration:none;">Terms</a>
          <span style="color:#4b5563;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a href="https://monietar.com.ng/privacy" style="color:#9ca3af;text-decoration:none;">Privacy</a>
        </p>
        <a style="margin:18px 0 0;color:#6b7280;font-size:10px;">Powered by <a href='https://algoritic.com.ng' style="color:#9ca3af;text-decoration:none;">Algoritic Inc.</a></a></p>
      </div>
    `;
    const emailLayout = (content: string) => `
      <div style="margin:0;padding:20px 10px;background:#24191b;font-family:Arial,Helvetica,sans-serif;color:#f9fafb;">
        <div style="max-width:620px;margin:0 auto;background:#111111;border:1px solid #2d3431;border-radius:4px;overflow:hidden;">
          ${emailHeader}
          ${content}
        </div>
      </div>
    `;

    const internalEmail = resend.emails.send({
      from: 'Monietar <support@monietar.com.ng>',
      to: 'support@monietar.com.ng',
      replyTo: email,
      subject: `[Contact] ${subjectLabel} - ${fullName}`,
      html: emailLayout(`
        <div style="background:#111111;padding:38px 32px 34px;text-align:left;">
          <p style="margin:0;color:#a7f3d0;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">New contact message</p>
          <h1 style="margin:16px 0 0;color:#ffffff;font-size:30px;line-height:1.15;letter-spacing:-.8px;">${safeSubject}</h1>
          <p style="margin:12px 0 0;color:#9ca3af;font-size:14px;line-height:1.6;">A new message is waiting for your team.</p>
        </div>
        <div style="padding:30px 32px 34px;background:#111111;">
          <div style="margin-bottom:22px;padding:18px 0;border-top:1px solid #374151;border-bottom:1px solid #374151;">
            <p style="margin:0 0 8px;color:#6ee7b7;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Contact details</p>
            <p style="margin:0 0 6px;color:#f9fafb;font-size:14px;"><strong>${safeName}</strong></p>
            <p style="margin:0;color:#6ee7b7;font-size:13px;">${safeEmail}</p>
          </div>
          <p style="margin:0 0 10px;color:#6ee7b7;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Message</p>
          <div style="padding:0;color:#e5e7eb;font-size:15px;line-height:1.75;">${safeMessage}</div>
          ${emailFooter}
        </div>
      `),
      text: `Name: ${fullName}\nEmail: ${email}\nSubject: ${subjectLabel}\n\n${message}`,
    });

    const senderEmail = resend.emails.send({
      from: 'Monietar <support@monietar.com.ng>',
      to: email,
      subject: `Thanks for reaching out - Monietar`,
      html: emailLayout(`
        <div style="background:#111111;padding:36px 32px 34px;text-align:left;">
          <h1 style="margin:20px 0 0;color:#ffffff;font-size:31px;line-height:1.15;letter-spacing:-.8px;">Thanks for reaching out.</h1>
          <p style="margin:12px 0 0;max-width:420px;color:#9ca3af;font-size:15px;line-height:1.7;">Your message is safely with our team, ${safeName}.</p>
        </div>
        <div style="padding:30px 32px 34px;background:#111111;">
          <div style="padding:22px 0;border-top:1px solid #374151;border-bottom:1px solid #374151;">
            <p style="margin:0;color:#6ee7b7;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">What happens next</p>
            <p style="margin:11px 0 0;color:#e5e7eb;font-size:15px;line-height:1.65;">Our team has received your message and will review your enquiry. You can expect a response within two business days.</p>
          </div>
          <div style="margin-top:24px;padding:20px 0;">
            <p style="margin:0 0 8px;color:#6ee7b7;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Your message</p>
            <p style="margin:0 0 12px;color:#f9fafb;font-size:14px;"><strong>${safeSubject}</strong></p>
            <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.75;">${safeMessage}</p>
          </div>
           <p style="margin:11px 0 0;color:#e5e7eb;font-size:15px;line-height:1.65;">For your security, Monietar will never ask you to share your password, PIN, OTP, or other confidential login credentials. Never disclose these details to anyone claiming to represent our team.</p>
          <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;line-height:1.7;">Need to add something? Simply reply to this email.</p>
          ${emailFooter}
        </div>
      `),
      text: `Hi ${fullName},\n\nThanks for reaching out to Monietar. Your message has been received and our team will get back to you within two business day.\n\nSubject: ${subjectLabel}\n\n${message}\n\nIf you need to add anything, simply reply to this email.`,
    });

    const emailResults = await Promise.allSettled([internalEmail, senderEmail]);
    emailResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          index === 0 ? '[Contact Support Notification Error]:' : '[Contact Sender Confirmation Error]:',
          result.reason
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your message has been sent successfully.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid contact submission.';
    const isValidationError =
      message.endsWith('is required.') ||
      message.endsWith('is too long.') ||
      message === 'Subject is too long.' ||
      message === 'Message is too long.';

    if (isValidationError) {
      return NextResponse.json({ message }, { status: 400 });
    }

    console.error('[Contact Submission Error]:', error);
    return NextResponse.json(
      { message: 'We could not process your message. Please try again.' },
      { status: 500 }
    );
  }
}
