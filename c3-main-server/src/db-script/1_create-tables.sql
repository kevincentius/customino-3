
CREATE TABLE SAMPLE_ENTITY (
  id SERIAL PRIMARY KEY,
  full_name TEXT,
  likes_to_play BOOLEAN
);

CREATE TABLE ACCOUNT (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  email_confirmed_at BIGINT,
  created_at BIGINT NOT NULL,
  last_login BIGINT NOT NULL
);
