import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovedInvoice {
  invoice_no: string;
  email: string;
  amount_input: number;
  base_currency: string;
  tpc_amount: number;
  wallet_tpc: string;
  approved_at: string;
  tpc_tx_hash?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invoice_no } = await req.json();

    if (!invoice_no) {
      return new Response(
        JSON.stringify({ error: "Invoice number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch invoice details
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("invoice_no", invoice_no)
      .single();

    if (fetchError || !invoice) {
      return new Response(
        JSON.stringify({ error: "Invoice not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Format currency
    const formatCurrency = (amount: number, currency: string) => {
      if (currency === "IDR") {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);
      }
      return `${amount.toLocaleString("id-ID")} ${currency}`;
    };

    // Send email
    const emailData = {
      from: "TPC Global <noreply@tpcglobal.io>",
      to: [invoice.email],
      subject: "TPC Anda Telah Dikirim ke Wallet",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TPC Anda Telah Dikirim</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0A0B0F;
              color: #ffffff;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #1A1B22 0%, #11161C 100%);
              border-radius: 16px;
              border: 1px solid #2B3139;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #F0B90B 0%, #E0A800 100%);
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              color: #1A1B22;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .invoice-details {
              background: #1E2329;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #2B3139;
            }
            .detail-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .label {
              color: #848E9C;
              font-size: 14px;
            }
            .value {
              color: #ffffff;
              font-weight: 600;
            }
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(34, 197, 94, 0.1);
              border: 1px solid rgba(34, 197, 94, 0.3);
              color: #22c55e;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
            }
            .wallet-info {
              background: #1E2329;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .wallet-address {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              word-break: break-all;
              color: #F0B90B;
              background: rgba(240, 185, 11, 0.1);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid rgba(240, 185, 11, 0.3);
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #F0B90B 0%, #E0A800 100%);
              color: #1A1B22;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 600;
              text-align: center;
              margin: 30px 0;
              transition: transform 0.2s;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .footer {
              text-align: center;
              padding: 30px;
              color: #848E9C;
              font-size: 12px;
              border-top: 1px solid #2B3139;
            }
            .tx-hash {
              font-family: 'Courier New', monospace;
              font-size: 11px;
              color: #848E9C;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 TPC Anda Telah Dikirim!</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Kami senang menginformasikan bahwa token TPC Anda telah berhasil dikirim ke wallet. 
                Terima kasih telah mempercayai TPC Global untuk edukasi trading Anda.
              </p>

              <div class="invoice-details">
                <div class="detail-row">
                  <span class="label">Invoice No</span>
                  <span class="value">${invoice.invoice_no}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Jumlah TPC</span>
                  <span class="value">${invoice.tpc_amount?.toLocaleString('id-ID') || 0} TPC</span>
                </div>
                <div class="detail-row">
                  <span class="label">Nominal Pembayaran</span>
                  <span class="value">${formatCurrency(invoice.amount_input, invoice.base_currency)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status</span>
                  <span class="status-badge">✅ COMPLETED</span>
                </div>
              </div>

              ${invoice.wallet_tpc ? `
              <div class="wallet-info">
                <h3 style="margin: 0 0 12px 0; color: #F0B90B;">📍 Wallet Tujuan</h3>
                <div class="wallet-address">${invoice.wallet_tpc}</div>
              </div>
              ` : ''}

              ${invoice.tpc_tx_hash ? `
              <div class="wallet-info">
                <h3 style="margin: 0 0 12px 0; color: #F0B90B;">🔗 Transaction Hash</h3>
                <div class="tx-hash">${invoice.tpc_tx_hash}</div>
                <p style="margin: 12px 0 0 0; font-size: 12px;">
                  <a href="https://solscan.io/tx/${invoice.tpc_tx_hash}" 
                     style="color: #F0B90B; text-decoration: none;" 
                     target="_blank">
                    Lihat di Solana Explorer →
                  </a>
                </p>
              </div>
              ` : ''}

              <div style="text-align: center;">
                <a href="https://tpcglobal.io/id/member/dashboard" class="cta-button">
                  Lihat di Member Area
                </a>
              </div>

              <p style="font-size: 14px; color: #848E9C; line-height: 1.6;">
                Jika Anda memiliki pertanyaan, jangan ragu menghubungi tim support kami.
              </p>
            </div>

            <div class="footer">
              <p>© 2024 TPC Global - Ekosistem Edukasi Trading Terpercaya</p>
              <p style="margin-top: 8px;">
                Email ini dikirim otomatis. Mohon tidak membalas email ini.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Failed to send email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent to ${invoice.email} for invoice ${invoice_no}`);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-invoice-approved-email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
