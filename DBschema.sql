CREATE TABLE tbl_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create TABLE tbl_edit_history (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  created_by INTEGER REFERENCES tbl_users(id),
  article_id INTEGER REFERENCES tbl_articles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- SELECT * from tbl_users

-- GRANT ALL PRIVILEGES ON DATABASE article_db TO rajesh;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rajesh;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rajesh;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rajesh;
