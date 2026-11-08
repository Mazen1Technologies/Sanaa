CREATE TABLE "dresses" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"image_key" text NOT NULL,
	"liked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
