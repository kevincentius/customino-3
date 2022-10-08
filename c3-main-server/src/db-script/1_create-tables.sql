
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
  email_confirm_code TEXT,
  reset_password_expiry BIGINT,
  reset_password_code TEXT,
  created_at BIGINT NOT NULL,
  last_login BIGINT NOT NULL,
  ip_csv TEXT
);
CREATE INDEX index_account_username ON ACCOUNT (username);
CREATE INDEX index_account_email ON ACCOUNT (email);
CREATE INDEX index_account_email_confirm_code ON ACCOUNT (email_confirm_code);
CREATE INDEX index_account_reset_password_code ON ACCOUNT (reset_password_code);

CREATE TABLE RATING (
    id SERIAL PRIMARY KEY,
    game_mode_season_id INTEGER,
    account_id INTEGER REFERENCES account(id),
    rating DOUBLE PRECISION NOT NULL,
    rd DOUBLE PRECISION NOT NULL,
    vol DOUBLE PRECISION NOT NULL,
    matches INTEGER,
    last_match_timestamps TEXT,
    UNIQUE (game_mode_season_id, account_id)
);
CREATE INDEX index_rating_account_id ON RATING (game_mode_season_id);
CREATE INDEX index_rating_account_id ON RATING (account_id);
