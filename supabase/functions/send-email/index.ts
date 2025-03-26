
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create SMTP client for Gmail
const createClient = () => {
  return new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 587,
      tls: true,
      auth: {
        username: Deno.env.get("GMAIL_USER") || "",
        password: Deno.env.get("GMAIL_APP_PASSWORD") || "",
      },
    },
  });
};

serve(async (req) => {
  console.log("Email function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, from } = await req.json();
    console.log("Email request data:", { to, subject, from });

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: 'to', 'subject', and either 'html' or 'text' are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const client = createClient();
    
    // Log before attempting to send
    console.log("Attempting to send email with SMTP client...");
    
    // Attempt to send email
    await client.send({
      from: from || Deno.env.get("DEFAULT_FROM_EMAIL") || "no-reply@talentats.com",
      to: Array.isArray(to) ? to : [to],
      subject,
      content: text ? text : undefined,
      html: html ? html : undefined,
    });

    await client.close();
    console.log("Email sent successfully");

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
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: "Check that GMAIL_USER and GMAIL_APP_PASSWORD are correctly set in Supabase secrets"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
