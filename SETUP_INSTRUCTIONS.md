# Инструкция по настройке портфолио

## 1. Настройка Supabase

### Создайте проект на https://supabase.com

### Выполните SQL запросы для создания таблиц:

```sql
-- Таблица для общей информации (About)
CREATE TABLE about (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  title TEXT,
  description TEXT,
  salesforce_skills TEXT,
  golang_skills TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для опыта работы
CREATE TABLE experience (
  id BIGSERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для проектов
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для контактов
CREATE TABLE contact (
  id BIGSERIAL PRIMARY KEY,
  email TEXT,
  telegram TEXT,
  github TEXT,
  linkedin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включите RLS (Row Level Security) - опционально для публичного доступа
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Создайте политики для публичного чтения и записи
CREATE POLICY "Public read access for about" ON about FOR SELECT USING (true);
CREATE POLICY "Public insert access for about" ON about FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for about" ON about FOR UPDATE USING (true);

CREATE POLICY "Public read access for experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public insert access for experience" ON experience FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for experience" ON experience FOR UPDATE USING (true);
CREATE POLICY "Public delete access for experience" ON experience FOR DELETE USING (true);

CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public insert access for projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Public delete access for projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Public read access for contact" ON contact FOR SELECT USING (true);
CREATE POLICY "Public insert access for contact" ON contact FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for contact" ON contact FOR UPDATE USING (true);
```

## 2. Настройка переменных окружения

1. Скопируйте файл `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Заполните `.env` вашими данными из Supabase:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Получить эти данные можно в Settings -> API вашего проекта Supabase.

## 3. Запуск проекта

```bash
npm install
npm run dev
```

## 4. Администрирование

- Нажмите кнопку "Вход" в навигационной панели
- Введите пароль (по умолчанию: `admin123`)
- После входа вы сможете редактировать, добавлять и удалять данные во всех разделах

**Важно:** Измените пароль в файле `src/components/AdminPanel.jsx` для безопасности!

## 5. Структура проекта

```
portfolio/
├── src/
│   ├── components/
│   │   ├── About.jsx         # Раздел "Обо мне"
│   │   ├── Experience.jsx    # Раздел "Опыт работы"
│   │   ├── Projects.jsx      # Раздел "Проекты"
│   │   ├── Contact.jsx       # Раздел "Контакты"
│   │   ├── Navbar.jsx        # Навигационная панель
│   │   └── AdminPanel.jsx    # Панель администратора
│   ├── lib/
│   │   └── supabase.js       # Конфигурация Supabase
│   ├── App.jsx               # Главный компонент
│   ├── main.jsx              # Точка входа
│   └── index.css             # Стили
├── .env.example              # Пример переменных окружения
└── SETUP_INSTRUCTIONS.md     # Эта инструкция
```

## 6. Особенности

- Дизайн вдохновлен https://brittanychiang.com
- Salesforce навыки выделены синим цветом (#00a1e0)
- Golang навыки выделены голубым цветом (#00add8)
- Все данные хранятся в PostgreSQL через Supabase
- Полностью адаптивный дизайн для мобильных устройств
