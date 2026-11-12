-- Creates one database per service that needs persistence.
-- Runs automatically on first Postgres container startup.
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE shipping_db;
