-- Revert bowling:frame from pg

BEGIN;

    drop table "frame" cascade;

COMMIT;
