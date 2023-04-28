
CREATE TABLE sample_entity (
  id SERIAL PRIMARY KEY,
  full_name TEXT,
  likes_to_play BOOLEAN
);

CREATE TABLE global_variables (
  id SERIAL PRIMARY KEY,
  variable TEXT NOT NULL,
  double_value DOUBLE PRECISION NOT NULL
);

CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(255) UNIQUE,
  email_confirmed_at BIGINT,
  email_confirm_code TEXT,
  reset_password_expiry BIGINT,
  reset_password_code TEXT,
  created_at BIGINT NOT NULL,
  last_login BIGINT NOT NULL,
  ip_csv TEXT
);
CREATE INDEX index_account_username ON account (username(255));
CREATE INDEX index_account_email ON account (email(255));
CREATE INDEX index_account_email_confirm_code ON account (email_confirm_code(255));
CREATE INDEX index_account_reset_password_code ON account (reset_password_code(255));

CREATE TABLE rating (
    id SERIAL PRIMARY KEY,
    game_mode_season_id INTEGER,
    account_id INTEGER REFERENCES account(id),
    rating DOUBLE PRECISION NOT NULL,
    rd DOUBLE PRECISION NOT NULL,
    vol DOUBLE PRECISION NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    matches INTEGER,
    last_match_timestamps TEXT,
    UNIQUE (game_mode_season_id, account_id)
);
CREATE INDEX index_rating_game_mode_season_id ON rating (game_mode_season_id);
CREATE INDEX index_rating_account_id ON rating (account_id);
CREATE INDEX index_rating_score ON rating (score);
