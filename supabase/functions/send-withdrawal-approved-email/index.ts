import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalApprovedEmailBody {
  withdrawal_id: string;
  amount_tpc: number;
  tx_hash: string;
  wallet_address: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse body
    const body: WithdrawalApprovedEmailBody = await req.json()
    const { withdrawal_id, amount_tpc, tx_hash, wallet_address } = body

    if (!withdrawal_id || !amount_tpc || amount_tpc <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid withdrawal_id or amount_tpc' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user from JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin permissions
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin')

    if (adminError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get withdrawal details with member email
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select(`
        id,
        user_id,
        amount_tpc,
        wallet_address,
        tx_hash,
        status,
        processed_at,
        profiles!inner(email, member_code)
      `)
      .eq('id', withdrawal_id)
      .single()

    if (withdrawalError || !withdrawal) {
      return new Response(
        JSON.stringify({ error: 'Withdrawal not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify withdrawal status
    if (withdrawal.status !== 'APPROVED') {
      return new Response(
        JSON.stringify({ error: 'Withdrawal must be approved to send notification' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send email to member
    const memberEmail = withdrawal.profiles.email
    const fromEmail = Deno.env.get('TPC_EMAIL_FROM') || 'TPC Global <onboarding@resend.dev>'

    const emailSubject = '[TPC] Withdraw Disetujui'
    const emailBody = `
Halo ${withdrawal.profiles.member_code || 'Member'},

Permintaan withdrawal Anda telah disetujui dan diproses.

DETAIL WITHDRAWAL:
- Jumlah: ${withdrawal.amount_tpc.toLocaleString('id-ID')} TPC
- Wallet Address: ${withdrawal.wallet_address || 'Tidak disediakan'}
- Transaction Hash: ${withdrawal.tx_hash || 'Tidak tersedia'}
- Waktu Proses: ${withdrawal.processed_at ? new Date(withdrawal.processed_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'N/A'}

INFORMASI PENTING:
- TPC telah dikirim ke wallet address Anda
- Simpan transaction hash sebagai bukti transaksi
- Proses transfer memerlukan beberapa waktu untuk konfirmasi di blockchain

KEAMANAN:
- Admin TPC Global tidak akan pernah meminta data pribadi melalui chat
- Jika ada yang menghubungi Anda mengatasnamakan admin, abaikan
- Jika ada ketidaksesuaian data, balas email ini segera

BUTUH BANTUAN?
Jika Anda memiliki pertanyaan atau mengalami masalah:
- Balas email ini
- Hubungi tim support TPC Global
- Jangan berikan informasi sensitif kepada siapa pun

Terima kasih telah mempercayai TPC Global.

Salam,
Tim TPC Global
    `.trim()

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [memberEmail],
      subject: emailSubject,
      html: `<pre style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${emailBody}</pre>`,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        email_id: emailData.id,
        member_email: memberEmail
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
