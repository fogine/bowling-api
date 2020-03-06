-- Deploy bowling:frame to pg

BEGIN;

    CREATE TABLE "frame" (
        id SERIAL PRIMARY KEY,
        game_id integer NOT NULL,
        player_id integer NOT NULL,
        score integer,
        throw_1 integer,
        throw_2 integer,
        is_strike boolean NOT NULL default false,
        is_spare boolean NOT NULL default false
    );

    ALTER TABLE ONLY frame ADD CONSTRAINT frame_game_id__fkey
    FOREIGN KEY (game_id) REFERENCES "game"(id) ON UPDATE CASCADE ON DELETE CASCADE;

    ALTER TABLE ONLY frame ADD CONSTRAINT frame_player_id__fkey
    FOREIGN KEY (player_id) REFERENCES "player"(id) ON UPDATE CASCADE ON DELETE CASCADE;
COMMIT;
