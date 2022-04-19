CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE DATABASE node_auth;

CREATE TABLE bp_users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bp_user_name TEXT NOT NULL,
    bp_user_code TEXT NOT NULL UNIQUE,
    bp_user_territory TEXT NOT NULL,
    bp_user_town TEXT NOT NULL,
    bp_user_touchPoint TEXT NOT NULL,
    bp_user_password TEXT NOT NULL,
    bp_user_admin BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE consumer (
    consumer_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_name TEXT NOT NULL,
    consumer_dob TEXT NOT NULL,
    consumer_phn TEXT NOT NULL,
    bp_user_code TEXT NOT NULL,
    onboarding_date DATE NOT NULL
);

--psql -U postgres
--\l
--\c node_auth
--\dt
--heroku pg:psql