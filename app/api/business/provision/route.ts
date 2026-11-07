import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST() {
  const authClient = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'You must be signed in to create a business.' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase service role key is not configured.' },
      { status: 500 }
    );
  }

  const supabase = createAdminClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: existingBusiness, error: lookupError } = await supabase
    .from('businesses')
    .select('id, owner_id, name, currency, is_active')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: lookupError.message },
      { status: 500 }
    );
  }

  if (existingBusiness) {
    if (!existingBusiness.is_active) {
      const { data: reactivatedBusiness, error: reactivateError } =
        await supabase
          .from('businesses')
          .update({ is_active: true })
          .eq('id', existingBusiness.id)
          .select('id, owner_id, name, currency, is_active')
          .single();

      if (reactivateError) {
        return NextResponse.json(
          { error: reactivateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ business: reactivatedBusiness });
    }

    return NextResponse.json({ business: existingBusiness });
  }

  const metadata = user.user_metadata || {};
  const metadataBusinessName =
    typeof metadata.business_name === 'string'
      ? metadata.business_name.trim()
      : '';
  const metadataName =
    typeof metadata.name === 'string' ? metadata.name.trim() : '';
  const businessName =
    metadataBusinessName ||
    (metadataName ? `${metadataName}'s business` : 'My business');

  const { data: business, error: createError } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      name: businessName,
      currency: 'NGN',
      is_active: true,
    })
    .select('id, owner_id, name, currency, is_active')
    .single();

  if (createError) {
    return NextResponse.json(
      { error: createError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ business }, { status: 201 });
}
