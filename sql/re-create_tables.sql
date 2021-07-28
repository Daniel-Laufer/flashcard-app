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
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE flashcard(
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES flashcard_collection(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  front_image_url TEXT,
  back_image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() 
);





SELECT flashcard_collection.*, users.username, users.profile_picture_url
  FROM flashcard_collection JOIN users ON flashcard_collection.user_id=users.id 
  WHERE flashcard_collection.id=19;

SELECT flashcard_collection.*, users.username, users.profile_picture_url
      FROM flashcard_collection JOIN users ON flashcard_collection.user_id=users.id 
      WHERE flashcard_collection.id=${req.params.flashcard_collection_id};





-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS locations CASCADE;
-- DROP TABLE IF EXISTS sizes CASCADE;
-- DROP TABLE IF EXISTS payment_information CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS toppings CASCADE;




-- CREATE TABLE "payment_information" (
--   "id" SERIAL PRIMARY KEY,
--   "full_name" VARCHAR NOT NULL,
--   "card_number" VARCHAR NOT NULL UNIQUE,
--   "cvv" INTEGER NOT NULL,
--   "expiration_date" VARCHAR NOT NULL,
--   "postal_code" VARCHAR NOT NULL
-- );


-- CREATE TABLE "locations" (
--   "id" SERIAL PRIMARY KEY,
--   "name" VARCHAR NOT NULL UNIQUE,
--   "open_hours" VARCHAR NOT NULL
-- );

-- CREATE TABLE "users" (
--   "id" SERIAL PRIMARY KEY,
--   "payment_info_id" INTEGER REFERENCES payment_information(id) ON DELETE CASCADE,
--   "email" VARCHAR NOT NULL UNIQUE,
--   "password" VARCHAR NOT NULL,
--   "location_id" INTEGER REFERENCES locations(id) ON DELETE CASCADE
-- );


-- CREATE TABLE "sizes" (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(5) NOT NULL,
--   price NUMERIC(2) NOT NULL

-- );

-- CREATE TABLE "toppings" (
--   "id" SERIAL PRIMARY KEY,
--   "name" VARCHAR NOT NULL UNIQUE
-- );

-- CREATE TABLE "orders" (
--   "id" SERIAL PRIMARY KEY,
--   "user_id" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   "status" VARCHAR NOT NULL,
--   "created_at" TIMESTAMP NOT NULL,
--   "location_id" INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
--   "size" char NOT NULL,
--   "payment_info_id" INTEGER NOT NULL REFERENCES payment_information(id) ON DELETE CASCADE,
--   "phone_number" VARCHAR NOT NULL,
--   "address" VARCHAR NOT NULL
-- );


-- COMMENT ON COLUMN "users"."location_id" IS 'user is an employee if this field is not null. If not null, this field specifies where this person works. ';