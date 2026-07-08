-- Paste this SQL into Supabase Dashboard → SQL Editor
-- Then run: npx tsx prisma/seed.ts (with correct DATABASE_URL)

CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");

CREATE TABLE "Iklan" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    CONSTRAINT "Iklan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
