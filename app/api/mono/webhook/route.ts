// pages/api/mono/webhook/route.ts
export async function POST(request: NextRequest) {
  const webhook = await request.json();
  
  if (webhook.event === 'mono.events.account_updated') {
    // Trigger sync for the account
    await syncAccountTransactions(webhook.data.id, webhook.data.user_id);
  }
  
  return NextResponse.json({ received: true });
}