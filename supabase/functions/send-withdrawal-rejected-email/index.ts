import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalRejectedEmailBody {
  withdrawal_id: string;
  amount_tpc: number;
  wallet_address: string | null;
  reason: string;
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
    const body: WithdrawalRejectedEmailBody = await req.json()
    const { withdrawal_id, amount_tpc, wallet_address, reason } = body

    if (!withdrawal_id || !amount_tpc || amount_tpc <= 0 || !reason) {
      return new Response(
        JSON.stringify({ error: 'Invalid withdrawal_id, amount_tpc, or reason' }),
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
        status,
        approved_at,
        reject_reason,
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
    if (withdrawal.status !== 'REJECTED') {
      return new Response(
        JSON.stringify({ error: 'Withdrawal must be rejected to send notification' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send email to member
    const memberEmail = withdrawal.profiles.email
    const fromEmail = Deno.env.get('TPC_EMAIL_FROM') || 'TPC Global <onboarding@resend.dev>'

    const emailSubject = '[TPC] Withdraw Ditolak'
    const emailBody = `
Halo ${withdrawal.profiles.member_code || 'Member'},

Permintaan withdrawal Anda telah ditolak oleh admin TPC Global.

DETAIL WITHDRAWAL:
- Jumlah: ${withdrawal.amount_tpc.toLocaleString('id-ID')} TPC
- Wallet Address: ${withdrawal.wallet_address || 'Tidak disediakan'}
- Waktu Request: ${new Date(withdrawal.requested_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
- Waktu Ditolak: ${withdrawal.approved_at ? new Date(withdrawal.approved_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'N/A'}

ALASAN PENOLAKAN:
${reason}

INFORMASI PENTING:
- Dana tidak dikirim ke wallet Anda
- Jumlah withdrawal dikembalikan ke saldo komisi Anda
- Anda dapat mengajukan withdrawal kembali setelah memperbaiki masalah

LANGKAH SELANJUTNYA:
1. Periksa alasan penolakan di atas
2. Perbaiki masalah yang disebutkan
3. Ajukan withdrawal kembali jika sudah memenuhi syarat

BUTUH BANTUAN?
Jika Anda memiliki pertanyaan atau mengalami masalah:
- Balas email ini
- Hubungi tim support TPC Global
- Jangan berikan informasi sensitif kepada siapa pun

KEAMANAN:
- Admin TPC Global tidak akan pernah meminta data pribadi melalui chat
- Jika ada yang menghubungi Anda mengatasnamakan admin, abaikan
- Selalu verifikasi informasi melalui email resmi atau dashboard

Terima kasih atas pengertian Anda.

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
