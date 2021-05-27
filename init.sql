CREATE TABLE "amocrm_keys" 
(
  "id" integer NOT NULL, 
  "token_type" character varying NOT NULL, 
  "expires_in" integer NOT NULL, 
  "access_token" character varying NOT NULL, 
  "refresh_token" character varying NOT NULL, 
  CONSTRAINT "PK_a1fa175acdbfb31c651596303b2" 
  PRIMARY KEY ("id")
);