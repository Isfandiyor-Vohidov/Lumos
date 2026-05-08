-- Демо-центр
INSERT INTO profiles (telegram_id, full_name, phone, role, center_id)
VALUES
  (123456789, 'Главный Админ', '+79991234567', 'admin', NULL);

-- Два активных курса
INSERT INTO courses (id, title, description, price, mentor_name, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'English Upper-Intermediate', 'Для тех, кто хочет заговорить уверенно', 15000.00, 'Анна Смирнова', true),
  ('a0000000-0000-0000-0000-000000000002', 'React Advanced', 'Глубокое погружение в экосистему React', 20000.00, 'Иван Петров', true);

-- Вопросы к первому курсу
INSERT INTO questions (id, course_id, question_text, options, correct_option_index, "order") VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'I ___ to the gym every day.', '["go","goes","going","gone"]', 0, 1),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'She ___ finished her homework.', '["has","have","had","having"]', 0, 2),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Choose the correct sentence:', '["He like coffee","He likes coffee","He liking coffee","He liked coffee"]', 1, 3);

-- Вопросы ко второму курсу
INSERT INTO questions (id, course_id, question_text, options, correct_option_index, "order") VALUES
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'What hook is used for side effects?', '["useState","useEffect","useContext","useReducer"]', 1, 1),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'JSX stands for...', '["JavaScript XML","JavaScript Extension","JSON XML","Java Syntax Extension"]', 0, 2);