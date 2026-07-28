import { query } from '../config/db';

export const initDatabase = async () => {
  const createTablesSQL = `
    
    -- 1. Таблиця користувачів
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      avatar_url TEXT
    );

    -- 2. Таблиця речей для оренди
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price_per_day DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      image_url TEXT[],
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Таблиця бронювання
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
      renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled_by_owner, cancelled_by_renter
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Таблиця чатів
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
      renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(item_id, renter_id) 
    );

    -- 5. Таблиця повідомлень
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE, 
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. Таблиця відгуків
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      rating INTEGER NOT NULL, 
      text_review VARCHAR(500) NOT NULL,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTablesSQL);
    console.log('✅ Усі таблиці в базі даних успішно перевірені/створені!');
  } catch (error) {
    console.error('❌ Помилка при ініціалізації бази даних:', error);
  }
};