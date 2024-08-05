CREATE TABLE "public"."journal_invitation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "email" text NOT NULL, "journal_id" uuid NOT NULL, "is_fulfilled" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("journal_id", "email"));COMMENT ON TABLE "public"."journal_invitation" IS E'if there is no user then there will be record';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_journal_invitation_updated_at"
BEFORE UPDATE ON "public"."journal_invitation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_journal_invitation_updated_at" ON "public"."journal_invitation"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
