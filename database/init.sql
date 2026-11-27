CREATE TABLE IF NOT EXISTS animals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  age VARCHAR(50) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'available',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO animals (name, species, breed, age, gender, status, description)
SELECT '豆漿', '貓咪', '米克斯（白貓）', '1 歲 2 個月', '女生', 'available', '親人愛撒嬌，喜歡曬太陽與逗貓棒，已完成基本疫苗接種。'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = '豆漿');

INSERT INTO animals (name, species, breed, age, gender, status, description)
SELECT '阿財', '狗狗', '台灣土狗（米克斯）', '2 歲', '男生', 'available', '個性穩重聰明，會基本坐下與握手指令，適合喜歡戶外散步的家庭。'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = '阿財');

INSERT INTO animals (name, species, breed, age, gender, status, description)
SELECT '橘子', '貓咪', '虎斑橘貓', '6 個月', '男生', 'available', '好奇心旺盛的小吃貨，活潑好動，能與其他貓咪和平相處。'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = '橘子');

INSERT INTO animals (name, species, breed, age, gender, status, description)
SELECT '麻糬', '狗狗', '柴犬', '3 歲', '女生', 'available', '溫順安靜，已結紮且完成晶片植入，期待一個溫暖的新家。'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = '麻糬');
