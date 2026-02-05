import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalRequestEmailBody {
  amount_tpc: number;
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
    const body: WithdrawalRequestEmailBody = await req.json()
    const { amount_tpc, wallet_address } = body

    if (!amount_tpc || amount_tpc <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount_tpc' }),
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

    // Get user profile for email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, member_code')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send email to admin
    const adminEmail = Deno.env.get('TPC_ADMIN_EMAIL') || 'tpcglobal.io@gmail.com'
    const fromEmail = Deno.env.get('TPC_EMAIL_FROM') || 'TPC Global <onboarding@resend.dev>'

    const emailSubject = '[TPC] Permintaan Withdraw Baru'
    const emailBody = `
Halo Admin TPC Global,

Ada permintaan withdrawal baru yang perlu diproses:

DETAIL MEMBER:
- Email: ${profile.email}
- User ID: ${user.id}
- Member Code: ${profile.member_code || 'N/A'}

DETAIL WITHDRAWAL:
- Jumlah: ${amount_tpc.toLocaleString('id-ID')} TPC
- Wallet Address: ${wallet_address || 'Tidak disediakan'}
- Waktu Request: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

INSTRUKSI:
1. Login ke Admin Panel untuk memproses permintaan ini
2. Verifikasi data withdrawal di sistem
3. Jangan proses dari DM atau chat pribadi
4. Pastikan wallet address valid sebelum approve

CATATAN:
- Ini adalah email otomatis dari sistem TPC Global
- Jika ada pertanyaan, hubungi tim teknis

Terima kasih,
Tim TPC Global
    `.trim()

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
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
        email_id: emailData.id
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
