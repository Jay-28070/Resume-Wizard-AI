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
    const { action, content, tone = "professional" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing resume generation request:", { action, tone });

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "enhance") {
      systemPrompt = `You are an expert resume writer and career consultant. Your task is to enhance the provided resume content by improving grammar, phrasing, impact statements, and overall professional presentation. Maintain the original structure but make the content more compelling and ATS-friendly. Tone: ${tone}.`;
      userPrompt = `Please enhance this resume:\n\n${content}`;
    } else if (action === "generate") {
      systemPrompt = `You are an expert resume writer. Create a professional, well-structured resume based on the provided information. Use strong action verbs, quantify achievements where possible, and format in a clear, ATS-friendly manner. Tone: ${tone}.`;
      userPrompt = `Generate a professional resume with this information:\n\n${JSON.stringify(content, null, 2)}`;
    } else {
      throw new Error("Invalid action");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Payment required, please add funds to your workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log("Resume generation successful");

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});