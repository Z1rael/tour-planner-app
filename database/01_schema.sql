CREATE EXTENSION IF NOT EXISTS postgis;

--- Tour Planner Database Schema
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transport_types (
    transportation_type_id  SERIAL PRIMARY KEY,
    transportation_name     VARCHAR(255) NOT NULL
);

CREATE TABLE tours (
    tour_id             SERIAL PRIMARY KEY,
    user_id             INT REFERENCES users(user_id) ON DELETE CASCADE,
    tour_name           VARCHAR(255) NOT NULL,
    tour_description    TEXT,
    transport_type_id   INT REFERENCES transport_types(transportation_type_id),
    tour_distance       FLOAT,    ---were we doing this in meters or kilometers? km for now
    route_information   GEOMETRY(LINESTRING, 4326) NOT NULL,
    image_path          TEXT,
    estimated_time      BIGINT CHECK (estimated_time >= 0)
);

CREATE TABLE tour_logs (
    log_id          SERIAL PRIMARY KEY,
    tour_id         INT REFERENCES tours(tour_id) ON DELETE CASCADE,
    user_id         INT REFERENCES users(user_id),
    log_date        TIMESTAMP,
    comment         TEXT,
    difficulty      SMALLINT CHECK (difficulty >= 1 AND difficulty <= 5),
    rating          SMALLINT CHECK (rating >= 1 AND rating <= 5),
    total_time      BIGINT CHECK (total_time >= 0),
    total_distance  FLOAT          ---needs to be changed to match tours.tour_distance if needed
);

CREATE INDEX tours_route_geom_idx ON tours USING GIST (route_information);