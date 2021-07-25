DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS payment_information CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS toppings CASCADE;


CREATE TABLE "payment_information" (
  "id" SERIAL PRIMARY KEY,
  "full_name" VARCHAR NOT NULL,
  "card_number" VARCHAR NOT NULL UNIQUE,
  "cvv" INTEGER NOT NULL,
  "expiration_date" VARCHAR NOT NULL,
  "postal_code" VARCHAR NOT NULL
);


CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR NOT NULL UNIQUE,
  "open_hours" VARCHAR NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "payment_info_id" INTEGER REFERENCES payment_information(id) ON DELETE CASCADE,
  "email" VARCHAR NOT NULL UNIQUE,
  "password" VARCHAR NOT NULL,
  "location_id" INTEGER REFERENCES locations(id) ON DELETE CASCADE
);


CREATE TABLE "sizes" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(5) NOT NULL,
  price NUMERIC(2) NOT NULL

);

CREATE TABLE "toppings" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "status" VARCHAR NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "location_id" INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  "size" char NOT NULL,
  "payment_info_id" INTEGER NOT NULL REFERENCES payment_information(id) ON DELETE CASCADE,
  "phone_number" VARCHAR NOT NULL,
  "address" VARCHAR NOT NULL
);


COMMENT ON COLUMN "users"."location_id" IS 'user is an employee if this field is not null. If not null, this field specifies where this person works. ';