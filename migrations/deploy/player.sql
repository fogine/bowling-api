-- Deploy bowling:player to pg

BEGIN;

    CREATE TABLE "player" (
        id SERIAL PRIMARY KEY,
        nickname character varying(32) NOT NULL,
        score integer NOT NULL default 0,
        game_id integer NOT NULL
    );

    ALTER TABLE ONLY player ADD CONSTRAINT player_game_id__fkey
    FOREIGN KEY (game_id) REFERENCES "game"(id) ON UPDATE CASCADE ON DELETE CASCADE;
COMMIT;
