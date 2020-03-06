-- Deploy bowling:game to pg

BEGIN;

    CREATE TABLE "game" (
        id SERIAL PRIMARY KEY,
        created_at timestamp with time zone NOT NULL default now(),
        updated_at timestamp with time zone NOT NULL default now()
    );

COMMIT;
