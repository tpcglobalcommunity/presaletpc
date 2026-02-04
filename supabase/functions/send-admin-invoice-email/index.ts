import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  invoice_no: string;
  base_currency: string;
  amount_input: number;
  tpc_amount: number;
  proof_url: string;
  member_email: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()

    // Validate required fields
    if (!payload.invoice_no || !payload.base_currency || !payload.amount_input || 
        !payload.tpc_amount || !payload.proof_url || !payload.member_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Send email using Supabase Auth Admin
    const { error } = await supabase.auth.admin.sendEmail({
      email: 'tpcglobal.io@gmail.com',
      subject: `[TPC] Invoice Menunggu Review: ${payload.invoice_no}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F0B90B;">🔔 Invoice Menunggu Review</h2>
          
          <div style="background: #1E2329; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: white; margin-top: 0;">Detail Invoice</h3>
            
            <p style="color: #848E9C; margin: 8px 0;">
              <strong>Invoice No:</strong> ${payload.invoice_no}
            </p>
            
            <p style="color: #848E9C; margin: 8px 0;">
              <strong>Member Email:</strong> ${payload.member_email}
            </p>
            
            <p style="color: #848E9C; margin: 8px 0;">
              <strong>Amount:</strong> ${payload.base_currency === 'IDR' 
                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload.amount_input)
                : `${payload.amount_input} ${payload.base_currency}`
              }
            </p>
            
            <p style="color: #848E9C; margin: 8px 0;">
              <strong>TPC Amount:</strong> ${new Intl.NumberFormat('id-ID').format(payload.tpc_amount)} TPC
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #F0B90B;">📎 Bukti Pembayaran</h3>
            <p style="color: white;">
              <a href="${payload.proof_url}" 
                 style="color: #F0B90B; text-decoration: none; padding: 8px 16px; background: rgba(240, 185, 11, 0.1); border-radius: 4px; display: inline-block;">
                Lihat Bukti Pembayaran
              </a>
            </p>
          </div>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="https://tpcglobal.io/id/admin/invoices" 
               style="color: white; text-decoration: none; padding: 12px 24px; background: #F0B90B; border-radius: 6px; display: inline-block; font-weight: bold;">
              📋 Buka Admin Invoice
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2B3139;">
            <p style="color: #848E9C; font-size: 12px; text-align: center;">
              Email ini dikirim otomatis oleh sistem TPC Global
            </p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
