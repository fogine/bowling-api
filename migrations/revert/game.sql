-- Revert bowling:game from pg

BEGIN;

    drop table "game" cascade;

COMMIT;
