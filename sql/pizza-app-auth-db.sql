DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS payment_information CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS topping_lists CASCADE;
DROP TABLE IF EXISTS toppings CASCADE;


CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "payment_info_id" int,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "location_id" int
);

CREATE TABLE "location" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL
);

CREATE TABLE "payment_information" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "card_number" varchar NOT NULL,
  "cvv" int NOT NULL,
  "expiration_date" date NOT NULL,
  "postal_code" varchar NOT NULL
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "status" varchar NOT NULL,
  "created_at" varchar NOT NULL,
  "location_id" int,
  "size" char NOT NULL,
  "topping_list_id" int NOT NULL,
  "payment_info_id" int NOT NULL,
  "full_name" varchar NOT NULL,
  "phone_number" varchar NOT NULL,
  "address" varchar NOT NULL
);

CREATE TABLE "topping_lists" (
  "id" SERIAL PRIMARY KEY
);

CREATE TABLE "toppings" (
  "id" SERIAL PRIMARY KEY,
  "list_id" int NOT NULL,
  "name" varchar NOT NULL
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("payment_info_id") REFERENCES "payment_information" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("payment_info_id") REFERENCES "payment_information" ("id");

ALTER TABLE "toppings" ADD FOREIGN KEY ("list_id") REFERENCES "topping_lists" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("topping_list_id") REFERENCES "topping_lists" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("location_id") REFERENCES "location" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("location_id") REFERENCES "location" ("id");

COMMENT ON COLUMN "users"."location_id" IS 'user is an employee if this field is not null. If not null, this field specifies where this person works. ';