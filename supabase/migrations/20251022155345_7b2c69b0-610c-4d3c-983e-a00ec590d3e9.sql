-- Create foods database table
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  serving_size TEXT NOT NULL,
  serving_unit TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fats_g NUMERIC NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read foods
CREATE POLICY "Anyone can view foods"
ON public.foods
FOR SELECT
USING (true);

-- Create index for fast searching
CREATE INDEX idx_foods_name ON public.foods USING gin(to_tsvector('english', name));
CREATE INDEX idx_foods_category ON public.foods(category);

-- Insert comprehensive food database
INSERT INTO public.foods (name, brand, serving_size, serving_unit, calories, protein_g, carbs_g, fats_g, category) VALUES
-- Proteins
('Chicken Breast (Grilled)', NULL, '100', 'g', 165, 31, 0, 3.6, 'Protein'),
('Salmon (Cooked)', NULL, '100', 'g', 206, 22, 0, 13, 'Protein'),
('Ground Beef (Lean)', NULL, '100', 'g', 250, 26, 0, 15, 'Protein'),
('Eggs (Large)', NULL, '1', 'egg', 70, 6, 0.5, 5, 'Protein'),
('Greek Yogurt (Plain)', NULL, '100', 'g', 59, 10, 3.6, 0.4, 'Protein'),
('Tuna (Canned in Water)', NULL, '100', 'g', 116, 26, 0, 0.8, 'Protein'),
('Turkey Breast', NULL, '100', 'g', 135, 30, 0, 1, 'Protein'),
('Pork Chop', NULL, '100', 'g', 231, 26, 0, 13, 'Protein'),
('Shrimp', NULL, '100', 'g', 99, 24, 0.2, 0.3, 'Protein'),
('Tofu (Firm)', NULL, '100', 'g', 144, 17, 3, 9, 'Protein'),

-- Carbs
('White Rice (Cooked)', NULL, '100', 'g', 130, 2.7, 28, 0.3, 'Carbs'),
('Brown Rice (Cooked)', NULL, '100', 'g', 112, 2.6, 24, 0.9, 'Carbs'),
('Pasta (Cooked)', NULL, '100', 'g', 131, 5, 25, 1.1, 'Carbs'),
('Sweet Potato (Baked)', NULL, '100', 'g', 90, 2, 21, 0.2, 'Carbs'),
('Oatmeal (Cooked)', NULL, '100', 'g', 71, 2.5, 12, 1.5, 'Carbs'),
('Quinoa (Cooked)', NULL, '100', 'g', 120, 4.4, 21, 1.9, 'Carbs'),
('Whole Wheat Bread', NULL, '1', 'slice', 80, 4, 14, 1, 'Carbs'),
('Bagel (Plain)', NULL, '1', 'bagel', 289, 11, 56, 2, 'Carbs'),
('Potato (Baked)', NULL, '100', 'g', 93, 2.5, 21, 0.1, 'Carbs'),

-- Vegetables
('Broccoli (Cooked)', NULL, '100', 'g', 35, 2.4, 7, 0.4, 'Vegetables'),
('Spinach (Raw)', NULL, '100', 'g', 23, 2.9, 3.6, 0.4, 'Vegetables'),
('Carrots (Raw)', NULL, '100', 'g', 41, 0.9, 10, 0.2, 'Vegetables'),
('Tomato (Raw)', NULL, '100', 'g', 18, 0.9, 3.9, 0.2, 'Vegetables'),
('Bell Pepper (Raw)', NULL, '100', 'g', 26, 1, 6, 0.3, 'Vegetables'),
('Cucumber', NULL, '100', 'g', 15, 0.7, 3.6, 0.1, 'Vegetables'),
('Lettuce (Romaine)', NULL, '100', 'g', 17, 1.2, 3.3, 0.3, 'Vegetables'),
('Cauliflower', NULL, '100', 'g', 25, 1.9, 5, 0.3, 'Vegetables'),

-- Fruits
('Apple', NULL, '1', 'medium', 95, 0.5, 25, 0.3, 'Fruits'),
('Banana', NULL, '1', 'medium', 105, 1.3, 27, 0.4, 'Fruits'),
('Orange', NULL, '1', 'medium', 62, 1.2, 15, 0.2, 'Fruits'),
('Strawberries', NULL, '100', 'g', 32, 0.7, 7.7, 0.3, 'Fruits'),
('Blueberries', NULL, '100', 'g', 57, 0.7, 14, 0.3, 'Fruits'),
('Grapes', NULL, '100', 'g', 69, 0.7, 18, 0.2, 'Fruits'),
('Watermelon', NULL, '100', 'g', 30, 0.6, 8, 0.2, 'Fruits'),

-- Dairy
('Milk (Whole)', NULL, '1', 'cup', 149, 8, 12, 8, 'Dairy'),
('Milk (Skim)', NULL, '1', 'cup', 83, 8, 12, 0.2, 'Dairy'),
('Cheddar Cheese', NULL, '28', 'g', 113, 7, 0.4, 9, 'Dairy'),
('Mozzarella Cheese', NULL, '28', 'g', 85, 6, 1, 6, 'Dairy'),
('Cottage Cheese', NULL, '100', 'g', 98, 11, 3.4, 4.3, 'Dairy'),

-- Fats & Oils
('Olive Oil', NULL, '1', 'tbsp', 119, 0, 0, 14, 'Fats'),
('Butter', NULL, '1', 'tbsp', 102, 0.1, 0, 12, 'Fats'),
('Avocado', NULL, '100', 'g', 160, 2, 9, 15, 'Fats'),
('Almonds', NULL, '28', 'g', 164, 6, 6, 14, 'Fats'),
('Peanut Butter', NULL, '2', 'tbsp', 188, 8, 7, 16, 'Fats'),
('Walnuts', NULL, '28', 'g', 185, 4, 4, 18, 'Fats'),

-- Common Meals
('Pizza (Cheese)', NULL, '1', 'slice', 285, 12, 36, 10, 'Fast Food'),
('Burger (Regular)', NULL, '1', 'burger', 354, 20, 33, 15, 'Fast Food'),
('French Fries', NULL, '100', 'g', 312, 3.4, 41, 15, 'Fast Food'),
('Sushi Roll (California)', NULL, '6', 'pieces', 255, 9, 38, 7, 'Fast Food'),
('Burrito (Chicken)', NULL, '1', 'burrito', 450, 25, 50, 15, 'Fast Food'),
('Sandwich (Turkey)', NULL, '1', 'sandwich', 320, 22, 35, 9, 'Fast Food');

-- Update meals table to support quantity
ALTER TABLE public.meals ADD COLUMN IF NOT EXISTS quantity NUMERIC DEFAULT 1;
ALTER TABLE public.meals ADD COLUMN IF NOT EXISTS food_id UUID REFERENCES public.foods(id);