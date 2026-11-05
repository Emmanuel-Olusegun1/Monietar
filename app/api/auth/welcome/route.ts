import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGO_URL =
  'https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png';

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
      })[character] || character,
  );

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error(
        '[Welcome Email Configuration Error] RESEND_API_KEY is missing.',
      );
      return NextResponse.json(
        { message: 'Welcome email is temporarily unavailable.' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === 'string'
        ? body.email.trim().toLowerCase()
        : '';
    const name =
      typeof body.name === 'string'
        ? body.name.trim().slice(0, 100)
        : '';

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: 'A valid email address is required.' },
        { status: 400 },
      );
    }

    const safeName = escapeHtml(name || 'there');
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: 'Monietar <welcome@monietar.com.ng>',
      to: email,
      subject: 'Welcome to Monietar',
      html: `
        <div style="margin:0;background:#171916;padding:32px 16px;font-family:Arial,sans-serif;color:#f5f5f0;">
          <div style="max-width:620px;margin:0 auto;background:#20231f;border:1px solid #343a32;">
            <div style="padding:28px 28px 20px;border-bottom:1px solid #343a32;">
              <img src="${LOGO_URL}" alt="Monietar" width="150" style="display:block;width:150px;height:auto;" />
            </div>
            <div style="padding:34px 28px 30px;">
              <p style="margin:0 0 14px;color:#8ca693;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Welcome to Monietar</p>
              <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.15;font-weight:700;">Your money, clearer from day one.</h1>
              <p style="margin:22px 0 0;color:#c6ccc4;font-size:16px;line-height:1.7;">Hi ${safeName}, your Monietar account is ready. You now have a focused workspace for understanding sales, expenses, cash, and business growth.</p>
              <div style="margin:28px 0;padding:20px;border-left:3px solid #79b58a;background:#293029;">
                <p style="margin:0;color:#ffffff;font-size:15px;line-height:1.6;">Start by adding your first transaction or connecting your merchant bank account from your dashboard.</p>
              </div>
              <a href="https://monietar.com.ng/dashboard/overview" style="display:inline-block;background:#79b58a;color:#122016;text-decoration:none;padding:13px 20px;font-size:14px;font-weight:bold;">Open your dashboard</a>
            </div>
            <div style="padding:20px 28px;border-top:1px solid #343a32;color:#8f998e;font-size:12px;line-height:1.6;">
              Monietar &bull; Built for clearer business decisions.
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Welcome Email Dispatch Error]:', error);
      return NextResponse.json(
        { message: 'Welcome email could not be sent.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Welcome Email Exception]:', error);
    return NextResponse.json(
      { message: 'Welcome email could not be sent.' },
      { status: 500 },
    );
  }
}
