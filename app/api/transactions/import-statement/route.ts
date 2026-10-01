import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase service role key is not configured.');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
};

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);

  return cells.map((cell) => cell.trim());
}

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function parseDecimal(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const cleaned = value
    .trim()
    .replace(/[$,\s]/g, '')
    .replace(/\(([^)]+)\)/g, '-$1');

  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.replace(/[^0-9.\-]/g, '');

  if (!normalized || normalized === '-' || normalized === '.') {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const raw = value.trim();

  if (!raw) {
    return null;
  }

  const normalized = raw.replace(/\s+/g, ' ');
  const variants = [
    normalized,
    normalized.replace(/\//g, '-'),
    normalized.replace(/\./g, '-'),
  ];

  for (const variant of variants) {
    const candidates = [variant];

    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(variant)) {
      const [day, month, year] = variant.split('-').map(Number);
      candidates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(variant)) {
      const [year, month, day] = variant.split('-').map(Number);
      candidates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }

    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(variant)) {
      const [day, month, year] = variant.split('/').map(Number);
      candidates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }

    if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(variant)) {
      const [day, month, yearShort] = variant.split('/').map(Number);
      const fullYear = yearShort < 50 ? 2000 + yearShort : 1900 + yearShort;
      candidates.push(`${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }

    for (const candidate of candidates) {
      const parsed = new Date(candidate);

      if (!Number.isNaN(parsed.getTime())) {
        const iso = parsed.toISOString().slice(0, 10);

        if (iso !== '1970-01-01') {
          return iso;
        }
      }
    }
  }

  return null;
}

function parseCsvTransactions(csvText: string) {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => parseCsvLine(line))
    .filter((line) => line.some((cell) => cell.trim() !== ''));

  if (rows.length < 2) {
    return [];
  }

  const headerRow = rows[0].map((cell) => cell.trim());
  const headers = headerRow.map(normalizeHeader);

  const dateIndex = headers.findIndex((header) =>
    ['date', 'transactiondate', 'posteddate', 'valuedate', 'dateoftransaction', 'operationdate', 'dateposted'].includes(header)
  );

  const descriptionIndex = headers.findIndex((header) =>
    ['description', 'narration', 'details', 'memo', 'transaction', 'particulars', 'label'].includes(header)
  );

  const debitIndex = headers.findIndex((header) =>
    ['debit', 'withdrawal', 'outflow', 'debitamount', 'amountdebit'].includes(header)
  );

  const creditIndex = headers.findIndex((header) =>
    ['credit', 'deposit', 'inflow', 'creditamount', 'amountcredit'].includes(header)
  );

  const amountIndex = headers.findIndex((header) =>
    ['amount', 'total', 'transactionamount', 'netamount', 'value'].includes(header)
  );

  const typeIndex = headers.findIndex((header) =>
    ['type', 'transactiontype', 'entrytype', 'direction'].includes(header)
  );

  const referenceIndex = headers.findIndex((header) =>
    ['reference', 'ref', 'transactionref', 'id', 'checknumber'].includes(header)
  );

  const parsed: Array<{
    type: 'income' | 'expense';
    amount: number;
    date: string;
    description: string;
    reference: string | null;
  }> = [];

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];

    const expectedDateValue = dateIndex >= 0 ? row[dateIndex] : '';
    const expectedDescriptionValue = descriptionIndex >= 0 ? row[descriptionIndex] : '';
    const rawTypeValue = typeIndex >= 0 ? row[typeIndex] : '';

    const debitValue = debitIndex >= 0 ? row[debitIndex] : '';
    const creditValue = creditIndex >= 0 ? row[creditIndex] : '';
    const amountValue = amountIndex >= 0 ? row[amountIndex] : '';
    const referenceValue = referenceIndex >= 0 ? row[referenceIndex] : '';

    const parsedDate = parseDateValue(expectedDateValue);

    const rawAmountSource =
      amountValue ||
      (debitValue && !creditValue ? debitValue : '') ||
      (creditValue && !debitValue ? creditValue : '') ||
      '';

    const parsedAmount = parseDecimal(rawAmountSource);

    if (!parsedDate || parsedAmount === null || parsedAmount === 0) {
      continue;
    }

    let transactionType: 'income' | 'expense' = 'income';
    let finalAmount = Math.abs(parsedAmount);

    const normalizedType = (rawTypeValue || '').toLowerCase();
    const hasDebitSignal =
      /debit|withdrawal|payment|expense|outflow|transferout|dr/.test(normalizedType) ||
      (debitValue && !creditValue && parsedAmount > 0);

    const hasCreditSignal =
      /credit|deposit|income|inflow|transferin|cr/.test(normalizedType) ||
      (creditValue && !debitValue && parsedAmount > 0);

    if (hasDebitSignal && !hasCreditSignal) {
      transactionType = 'expense';
    } else if (hasCreditSignal && !hasDebitSignal) {
      transactionType = 'income';
    } else if (debitValue && !creditValue) {
      transactionType = 'expense';
    } else if (creditValue && !debitValue) {
      transactionType = 'income';
    } else if (parsedAmount < 0) {
      transactionType = 'expense';
      finalAmount = Math.abs(parsedAmount);
    }

    const description =
      (expectedDescriptionValue || rawTypeValue || 'Imported transaction').trim() || 'Imported transaction';

    parsed.push({
      type: transactionType,
      amount: finalAmount,
      date: parsedDate,
      description: description.slice(0, 180),
      reference: referenceValue?.trim() ? referenceValue.trim().slice(0, 120) : null,
    });
  }

  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const accountId = String(formData.get('account_id') || '').trim();
    const userId = String(formData.get('user_id') || '').trim();
    const currency = String(formData.get('currency') || 'NGN').trim().toUpperCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No bank statement file was provided.' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'The user details are required to import a statement.' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();

    if (fileName.endsWith('.pdf') || mimeType.includes('pdf')) {
      return NextResponse.json(
        {
          error:
            'PDF statement imports are not enabled in this environment yet. Please upload a CSV export from your bank or add the transactions manually.',
        },
        { status: 400 }
      );
    }

    if (!fileName.endsWith('.csv') && !mimeType.includes('csv') && !mimeType.includes('excel')) {
      return NextResponse.json(
        { error: 'Only CSV bank statements are supported for import right now.' },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const transactions = parseCsvTransactions(csvText);

    if (!transactions.length) {
      return NextResponse.json(
        { error: 'No valid transactions were found in the uploaded CSV file.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const payload = transactions.map((transaction) => ({
      user_id: userId,
      type: transaction.type,
      amount: transaction.amount,
      amount_base: transaction.amount,
      currency,
      exchange_rate: 1,
      category: transaction.type === 'income' ? 'Other income' : 'Other expense',
      description: transaction.description,
      date: transaction.date,
      account_id: accountId || null,
      status: 'completed',
      reference: transaction.reference,
      notes: 'Imported from CSV statement',
      is_deleted: false,
      source: 'statement_import',
    }));

    const { error } = await supabase.from('transactions').insert(payload);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      inserted: payload.length,
      source: 'statement_import',
      accountId,
      currency,
    });
  } catch (error) {
    console.error('Bank statement import failed:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to import the uploaded bank statement.',
      },
      { status: 500 }
    );
  }
}
