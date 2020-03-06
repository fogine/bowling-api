-- Revert bowling:player from pg

BEGIN;

    drop table "player" cascade;

COMMIT;
