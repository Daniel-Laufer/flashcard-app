CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(20) NOT NULL,
  profile_picture_url TEXT
);


CREATE TABLE flashcard_collection(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  public BOOLEAN DEFAULT FALSE,
  rating int,
  numRatings INT DEFAULT 0,
  sumRatings INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  description TEXT NOT NULL
);

CREATE TABLE flashcard(
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES flashcard_collection(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  front_image_key TEXT,
  back_image_key TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() 
);
