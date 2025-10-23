-- Insert comprehensive Indian food items
INSERT INTO public.foods (name, brand, calories, protein_g, carbs_g, fats_g, serving_size, serving_unit, category) VALUES
-- Indian Breakfast Items
('Idli', 'Homemade', 39, 1.5, 8.2, 0.2, '1', 'piece', 'Breakfast'),
('Dosa', 'Homemade', 133, 3.2, 26.5, 1.5, '1', 'piece', 'Breakfast'),
('Masala Dosa', 'Homemade', 268, 4.8, 42.5, 8.5, '1', 'piece', 'Breakfast'),
('Upma', 'Homemade', 165, 4.2, 28.5, 3.8, '1', 'cup', 'Breakfast'),
('Poha', 'Homemade', 158, 3.5, 30.2, 2.5, '1', 'cup', 'Breakfast'),
('Paratha Plain', 'Homemade', 210, 5.2, 28.5, 8.5, '1', 'piece', 'Breakfast'),
('Aloo Paratha', 'Homemade', 290, 6.8, 38.5, 11.2, '1', 'piece', 'Breakfast'),

-- Rice & Grains
('Steamed Basmati Rice', NULL, 160, 3.5, 35.0, 0.3, '1', 'cup', 'Grains'),
('Jeera Rice', 'Homemade', 190, 3.8, 36.5, 3.5, '1', 'cup', 'Grains'),
('Biryani (Chicken)', 'Homemade', 380, 22.5, 42.5, 12.5, '1', 'plate', 'Main Course'),
('Biryani (Veg)', 'Homemade', 295, 8.2, 48.5, 7.5, '1', 'plate', 'Main Course'),
('Pulao', 'Homemade', 220, 5.5, 38.2, 5.2, '1', 'cup', 'Grains'),
('Curd Rice', 'Homemade', 168, 5.8, 28.5, 3.5, '1', 'cup', 'Main Course'),

-- Roti & Breads
('Roti/Chapati', 'Homemade', 71, 2.5, 15.2, 0.4, '1', 'piece', 'Breads'),
('Naan', 'Homemade', 262, 7.2, 45.5, 5.2, '1', 'piece', 'Breads'),
('Bhakri', 'Homemade', 100, 3.2, 20.5, 0.8, '1', 'piece', 'Breads'),
('Puri', 'Homemade', 112, 2.2, 13.5, 5.8, '1', 'piece', 'Breads'),

-- Dal (Lentils)
('Dal Tadka', 'Homemade', 142, 9.5, 20.5, 2.8, '1', 'cup', 'Dal'),
('Dal Fry', 'Homemade', 156, 10.2, 21.5, 3.5, '1', 'cup', 'Dal'),
('Sambar', 'Homemade', 125, 6.8, 18.5, 3.2, '1', 'cup', 'Dal'),
('Rajma (Kidney Beans)', 'Homemade', 185, 11.5, 28.5, 2.8, '1', 'cup', 'Dal'),
('Chana Masala', 'Homemade', 210, 12.5, 32.5, 4.2, '1', 'cup', 'Dal'),
('Moong Dal', 'Homemade', 135, 8.8, 19.5, 2.5, '1', 'cup', 'Dal'),

-- Vegetables
('Mixed Vegetable Curry', 'Homemade', 125, 3.5, 18.5, 4.5, '1', 'cup', 'Vegetables'),
('Palak Paneer', 'Homemade', 265, 14.5, 12.5, 18.5, '1', 'cup', 'Vegetables'),
('Paneer Butter Masala', 'Homemade', 385, 16.5, 15.5, 28.5, '1', 'cup', 'Vegetables'),
('Aloo Gobi', 'Homemade', 145, 3.8, 22.5, 4.8, '1', 'cup', 'Vegetables'),
('Baingan Bharta', 'Homemade', 128, 3.2, 15.5, 6.2, '1', 'cup', 'Vegetables'),
('Bhindi Masala', 'Homemade', 118, 3.5, 14.5, 5.2, '1', 'cup', 'Vegetables'),
('Aloo Matar', 'Homemade', 165, 5.2, 24.5, 5.5, '1', 'cup', 'Vegetables'),

-- Paneer Dishes
('Paneer Tikka', 'Homemade', 295, 18.5, 8.5, 21.5, '100', 'g', 'Snacks'),
('Paneer (Raw)', NULL, 265, 18.3, 1.2, 20.8, '100', 'g', 'Dairy'),
('Shahi Paneer', 'Homemade', 342, 15.8, 14.5, 25.2, '1', 'cup', 'Main Course'),

-- Chicken Dishes
('Chicken Curry', 'Homemade', 285, 28.5, 8.5, 15.2, '1', 'cup', 'Main Course'),
('Butter Chicken', 'Homemade', 438, 32.5, 12.5, 28.5, '1', 'cup', 'Main Course'),
('Tandoori Chicken', 'Homemade', 220, 32.8, 4.5, 8.2, '100', 'g', 'Main Course'),
('Chicken Tikka', 'Homemade', 186, 29.5, 3.2, 6.5, '100', 'g', 'Snacks'),

-- Snacks
('Samosa', 'Homemade', 262, 4.5, 28.5, 14.5, '1', 'piece', 'Snacks'),
('Pakora (Mixed Veg)', 'Homemade', 158, 3.8, 18.5, 7.8, '100', 'g', 'Snacks'),
('Vada Pav', 'Street Food', 285, 6.5, 38.5, 11.5, '1', 'piece', 'Snacks'),
('Pav Bhaji', 'Homemade', 312, 7.8, 42.5, 12.5, '1', 'plate', 'Snacks'),
('Dhokla', 'Homemade', 160, 5.5, 28.5, 2.8, '100', 'g', 'Snacks'),
('Kachori', 'Homemade', 186, 4.2, 22.5, 9.2, '1', 'piece', 'Snacks'),

-- Dairy
('Curd/Dahi', NULL, 98, 11.0, 4.7, 4.3, '1', 'cup', 'Dairy'),
('Lassi (Sweet)', 'Homemade', 142, 3.8, 24.5, 3.2, '1', 'glass', 'Beverages'),
('Lassi (Salted)', 'Homemade', 68, 3.2, 8.5, 2.5, '1', 'glass', 'Beverages'),
('Buttermilk', 'Homemade', 42, 2.8, 5.5, 1.2, '1', 'glass', 'Beverages'),

-- South Indian
('Rava Dosa', 'Homemade', 168, 3.5, 28.5, 4.5, '1', 'piece', 'Breakfast'),
('Medu Vada', 'Homemade', 145, 5.2, 18.5, 6.2, '1', 'piece', 'Snacks'),
('Uttapam', 'Homemade', 185, 5.8, 32.5, 3.5, '1', 'piece', 'Breakfast'),
('Pongal', 'Homemade', 195, 6.2, 32.5, 4.8, '1', 'cup', 'Breakfast'),

-- Street Food
('Pani Puri', 'Street Food', 125, 2.8, 24.5, 2.2, '6', 'pieces', 'Snacks'),
('Bhel Puri', 'Street Food', 168, 4.5, 28.5, 4.2, '1', 'cup', 'Snacks'),
('Sev Puri', 'Street Food', 212, 5.2, 32.5, 6.8, '1', 'serving', 'Snacks'),
('Dahi Puri', 'Street Food', 195, 5.8, 28.5, 6.2, '6', 'pieces', 'Snacks'),

-- Sweets (Mithai)
('Gulab Jamun', 'Homemade', 175, 2.8, 28.5, 6.2, '1', 'piece', 'Desserts'),
('Jalebi', 'Homemade', 150, 1.2, 28.5, 4.2, '1', 'piece', 'Desserts'),
('Rasgulla', 'Homemade', 106, 1.8, 22.5, 0.8, '1', 'piece', 'Desserts'),
('Kheer', 'Homemade', 195, 5.2, 32.5, 4.8, '1', 'cup', 'Desserts'),
('Halwa', 'Homemade', 242, 3.8, 38.5, 8.5, '100', 'g', 'Desserts'),

-- Beverages
('Masala Chai', 'Homemade', 65, 2.2, 8.5, 2.8, '1', 'cup', 'Beverages'),
('Filter Coffee', 'Homemade', 42, 1.5, 4.2, 2.2, '1', 'cup', 'Beverages'),
('Badam Milk', 'Homemade', 168, 5.8, 22.5, 6.2, '1', 'glass', 'Beverages'),

-- Eggs
('Egg Bhurji', 'Homemade', 185, 14.5, 3.2, 12.8, '1', 'serving', 'Main Course'),
('Egg Curry', 'Homemade', 212, 13.8, 6.5, 14.5, '1', 'serving', 'Main Course'),
('Boiled Egg', NULL, 68, 5.5, 0.6, 4.8, '1', 'piece', 'Protein'),

-- Additional Popular Items
('Chole Bhature', 'Homemade', 485, 12.5, 62.5, 18.5, '1', 'plate', 'Main Course'),
('Misal Pav', 'Homemade', 385, 14.2, 52.5, 12.8, '1', 'plate', 'Main Course'),
('Poori Bhaji', 'Homemade', 425, 8.5, 58.5, 16.5, '1', 'plate', 'Breakfast'),
('Thepla', 'Homemade', 95, 2.8, 16.5, 2.2, '1', 'piece', 'Breads');
