import { supabase } from '@/integrations/supabase/client';

export interface Invoice {
  invoice_no: string;
  status: string;
  amount_input: number;
  base_currency: string;
  amount_usd: number;
  tpc_amount: number;
  created_at: string;
  email: string;
  transfer_method?: string;
  wallet_tpc?: string;
  proof_url?: string;
  proof_uploaded_at?: string;
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
}

export interface FetchInvoicesOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export async function fetchInvoices(options: FetchInvoicesOptions = {}) {
  let query = supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }

  return data as Invoice[];
}

export async function fetchInvoiceById(invoiceNo: string) {
  if (!invoiceNo) {
    throw new Error('Invoice No is required');
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('invoice_no', invoiceNo)
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }

  return data as Invoice;
}

export async function updateInvoiceStatus(invoiceNo: string, status: string, note?: string) {
  if (!invoiceNo) {
    throw new Error('Invoice No is required');
  }

  const updateData: any = {
    status,
    reviewed_at: new Date().toISOString(),
  };

  if (note) {
    updateData.review_note = note;
  }

  const { data, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('invoice_no', invoiceNo)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }

  return data as Invoice;
}
