
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create SMTP client
const createClient = () => {
  return new SMTPClient({
    connection: {
      hostname: Deno.env.get("SMTP_HOSTNAME") || "smtp.gmail.com",
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      tls: true,
      auth: {
        username: Deno.env.get("SMTP_USERNAME") || "",
        password: Deno.env.get("SMTP_PASSWORD") || "",
      },
    },
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, html, text, from, attachments } = await req.json();

    // Validate required fields
    if (!recipients || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: recipients, subject, and either html or text are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const client = createClient();
    
    // Attempt to send email
    await client.send({
      from: from || Deno.env.get("SMTP_FROM") || "no-reply@talentats.com",
      to: Array.isArray(recipients) ? recipients : [recipients],
      subject,
      content: text ? text : undefined,
      html: html ? html : undefined,
      attachments: attachments || [],
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
