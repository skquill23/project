import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error("Message and userId are required");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Fetch user profile and recent data for context
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const today = new Date().toISOString().split("T")[0];
    const { data: todaySummary } = await supabaseClient
      .from("daily_nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    // Build context for AI
    let context = "User Profile:\n";
    if (profile) {
      context += `- Fitness Goal: ${profile.fitness_goal}\n`;
      context += `- Activity Level: ${profile.activity_level}\n`;
      context += `- Daily Calorie Target: ${profile.daily_calorie_target} kcal\n`;
      context += `- Current Weight: ${profile.current_weight_kg} kg\n`;
      context += `- Target Weight: ${profile.target_weight_kg} kg\n`;
    }

    if (todaySummary) {
      context += `\nToday's Nutrition:\n`;
      context += `- Calories: ${todaySummary.total_calories} kcal\n`;
      context += `- Protein: ${todaySummary.total_protein_g}g\n`;
      context += `- Carbs: ${todaySummary.total_carbs_g}g\n`;
      context += `- Fats: ${todaySummary.total_fats_g}g\n`;
    }

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert AI fitness and nutrition coach. Provide personalized, actionable advice based on the user's data. Be encouraging, supportive, and specific. Keep responses concise but helpful (2-4 sentences). Use emojis occasionally to be friendly.

${context}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to get AI response");
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-coach:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
