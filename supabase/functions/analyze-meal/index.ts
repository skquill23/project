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
    const { mealDescription, imageBase64 } = await req.json();

    if (!mealDescription && !imageBase64) {
      throw new Error("Meal description or image is required");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    // Create Supabase client with proper auth handling
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error("User not authenticated");
    }

    // Call Lovable AI to analyze the meal
    const messages: any[] = [
      {
        role: "system",
        content: `You are an expert nutritionist and food analyst. Analyze the meal description or image and provide highly accurate nutritional estimates based on standard food databases (USDA, nutritionix).

Return ONLY a valid JSON object with this exact structure:
{
  "calories": number (total kcal),
  "protein_g": number (grams),
  "carbs_g": number (grams),
  "fats_g": number (grams),
  "meal_type": "breakfast/lunch/dinner/snack"
}

Critical instructions:
- Be highly accurate with calorie and macro estimates based on standard portion sizes
- If quantities/portions are specified (e.g., "2 eggs", "1 cup rice"), use exact measurements
- If no quantity specified, assume standard serving sizes
- Break down composite meals into individual components for accuracy
- For meal_type, intelligently determine from the foods: breakfast (eggs, toast, cereal), lunch (sandwiches, salads), dinner (heavier proteins, full meals), snack (light items)
- Return ONLY the JSON object, no markdown, no explanations`,
      },
    ];

    if (imageBase64) {
      // If image is provided, use vision model
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: mealDescription ? `Analyze this meal image. Additional context: ${mealDescription}` : "Analyze this meal image and identify all food items visible.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      // Text-only analysis
      messages.push({
        role: "user",
        content: `Analyze this meal: ${mealDescription}`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to analyze meal");
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    let nutritionData;
    try {
      nutritionData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("Invalid response from AI");
    }

    // Insert meal into database
    const { error: mealError } = await supabaseClient.from("meals").insert({
      user_id: user.id,
      meal_description: mealDescription,
      calories: nutritionData.calories,
      protein_g: nutritionData.protein_g,
      carbs_g: nutritionData.carbs_g,
      fats_g: nutritionData.fats_g,
      meal_type: nutritionData.meal_type,
    });

    if (mealError) throw mealError;

    // Update or create daily summary
    const today = new Date().toISOString().split("T")[0];

    const { data: existingSummary } = await supabaseClient
      .from("daily_nutrition_summary")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (existingSummary) {
      await supabaseClient
        .from("daily_nutrition_summary")
        .update({
          total_calories: existingSummary.total_calories + nutritionData.calories,
          total_protein_g: existingSummary.total_protein_g + nutritionData.protein_g,
          total_carbs_g: existingSummary.total_carbs_g + nutritionData.carbs_g,
          total_fats_g: existingSummary.total_fats_g + nutritionData.fats_g,
          meals_count: existingSummary.meals_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSummary.id);
    } else {
      await supabaseClient.from("daily_nutrition_summary").insert({
        user_id: user.id,
        date: today,
        total_calories: nutritionData.calories,
        total_protein_g: nutritionData.protein_g,
        total_carbs_g: nutritionData.carbs_g,
        total_fats_g: nutritionData.fats_g,
        meals_count: 1,
      });
    }

    return new Response(JSON.stringify({ success: true, data: nutritionData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-meal:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
