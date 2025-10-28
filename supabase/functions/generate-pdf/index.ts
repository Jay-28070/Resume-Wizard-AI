import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html } = await req.json();
    const PDFCO_API_KEY = Deno.env.get("PDFCO_API_KEY");

    if (!PDFCO_API_KEY) {
      throw new Error("PDFCO_API_KEY is not configured");
    }

    console.log("Generating PDF from HTML");

    const response = await fetch("https://api.pdf.co/v1/pdf/convert/from/html", {
      method: "POST",
      headers: {
        "x-api-key": PDFCO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: html,
        name: "resume.pdf",
        margins: "10mm",
        paperSize: "Letter",
        orientation: "Portrait",
        printBackground: true,
        header: "",
        footer: "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDF.co error:", response.status, errorText);
      throw new Error("Failed to generate PDF");
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("No PDF URL returned");
    }

    console.log("PDF generated successfully:", data.url);

    return new Response(
      JSON.stringify({ url: data.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});