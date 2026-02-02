import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExpiredInvoice {
  invoice_no: string;
  email: string;
  amount_input: number;
  base_currency: string;
  tpc_amount: number;
}

async function sendExpiredNotification(
  resend: Resend,
  invoice: ExpiredInvoice
) {
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

  try {
    await resend.emails.send({
      from: "TPC <noreply@tpcommunity.id>",
      to: [invoice.email],
      subject: `Invoice ${invoice.invoice_no} Telah Kedaluwarsa`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">
            <div style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); padding: 30px; text-align: center;">
              <h1 style="color: #0a0a0a; margin: 0; font-size: 24px; font-weight: bold;">Invoice Kedaluwarsa</h1>
            </div>
            
            <div style="padding: 30px;">
              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Halo,
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                Invoice Anda dengan nomor <strong style="color: #d4af37;">${invoice.invoice_no}</strong> telah kedaluwarsa karena tidak ada pembayaran yang diterima dalam waktu 23 jam.
              </p>
              
              <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Detail Invoice</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #888; padding: 8px 0; font-size: 14px;">No. Invoice</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right; font-family: monospace;">${invoice.invoice_no}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; padding: 8px 0; font-size: 14px;">Nominal</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right;">${formatCurrency(invoice.amount_input, invoice.base_currency)}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; padding: 8px 0; font-size: 14px;">TPC</td>
                    <td style="color: #d4af37; padding: 8px 0; font-size: 14px; text-align: right; font-weight: bold;">${invoice.tpc_amount.toLocaleString("id-ID")} TPC</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                Jika Anda masih ingin membeli TPC, silakan buat invoice baru melalui aplikasi kami.
              </p>
              
              <div style="text-align: center;">
                <a href="https://tpcommunity.id/id/buytpc" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); color: #0a0a0a; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                  Buat Invoice Baru
                </a>
              </div>
            </div>
            
            <div style="background-color: #0d0d0d; padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2026 TP Community. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`Email sent to ${invoice.email} for invoice ${invoice.invoice_no}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${invoice.email}:`, error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Get expired unpaid invoices with email info
    const { data: expiredInvoices, error: selectError } = await supabase
      .from("invoices")
      .select("invoice_no, email, amount_input, base_currency, tpc_amount")
      .eq("status", "UNPAID")
      .lt("expires_at", new Date().toISOString());

    if (selectError) {
      throw selectError;
    }

    if (!expiredInvoices || expiredInvoices.length === 0) {
      console.log("No invoices to expire");
      return new Response(
        JSON.stringify({
          success: true,
          expired_count: 0,
          expired_invoices: [],
          emails_sent: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update status to EXPIRED
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: "EXPIRED" })
      .eq("status", "UNPAID")
      .lt("expires_at", new Date().toISOString());

    if (updateError) {
      throw updateError;
    }

    // Send email notifications
    let emailsSent = 0;
    if (resend) {
      for (const invoice of expiredInvoices) {
        const sent = await sendExpiredNotification(resend, invoice);
        if (sent) emailsSent++;
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping email notifications");
    }

    console.log(`Expired ${expiredInvoices.length} invoices, sent ${emailsSent} emails`);

    return new Response(
      JSON.stringify({
        success: true,
        expired_count: expiredInvoices.length,
        expired_invoices: expiredInvoices.map((i) => i.invoice_no),
        emails_sent: emailsSent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error expiring invoices:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
