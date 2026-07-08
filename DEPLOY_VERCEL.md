# Deploy ke Vercel

Project ini menggunakan **SQLite** dan **file system lokal** untuk upload gambar — keduanya **tidak kompatibel** dengan Vercel (serverless ephemeral).  
Berikut langkah-langkah migrasi sebelum deploy.

---

## 1. Migrasi Database: SQLite → PostgreSQL (Supabase)

Ganti SQLite dengan database PostgreSQL dari Supabase.

### a. Buat project di Supabase

1. Daftar/login di [Supabase](https://supabase.com)
2. Buat project baru
3. Dapatkan **Database connection string** di Project Settings → Database → Connection string → URI

### b. Update Prisma schema

```prisma
datasource db {
  provider = "postgresql" 
}
```

### c. Update adapter di `app/lib/prisma.ts`

Gunakan `@prisma/adapter-pg` untuk koneksi PostgreSQL:

```ts
import "server-only";
import { PrismaClient } from "@/app/lib/prisma-client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### d. Generate ulang Prisma client

```bash
npx prisma generate
```

### e. Push schema ke database

Gunakan Supabase SQL Editor (dashboard → SQL Editor) atau jalankan dari lingkungan yang mendukung IPv6:

```bash
npx prisma db push
```

### f. Update `next.config.ts`

`serverExternalPackages` sudah tidak diperlukan.

---

## 2. Upload File: Local → Supabase Storage

1. Buat bucket `uploads` (public) di Supabase Storage
2. Copy `SUPABASE_URL` dan `SUPABASE_ANON_KEY` ke `.env`
3. Fungsi `saveFile` di `app/actions/movie.ts` sudah menggunakan Supabase

---

## 3. Environment Variables di Vercel

Setel di Vercel Dashboard → Project Settings → Environment Variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:...@db.[project].supabase.co:5432/postgres?sslmode=require` |
| `SESSION_SECRET` | `openssl rand -base64 32` (generate baru) |
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_ANON_KEY` | Anon key dari Supabase |

---

## 4. Deploy ke Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Atau hubungkan GitHub repo langsung dari [Vercel Dashboard](https://vercel.com/new).

---

## 5. Catatan Penting

| Fitur | Lokal | Vercel |
|---|---|---|
| Database | SQLite (file) | PostgreSQL (Supabase) |
| Upload file | `public/uploads/` | Supabase Storage |
| Gambar | Local path | URL publik dari Supabase |
| Session | Cookie + SESSION_SECRET | Sama (via env var) |

Seed data awal:

```bash
DATABASE_URL="postgresql://postgres:...@db.[project].supabase.co:5432/postgres?sslmode=require" npx tsx prisma/seed.ts
```

### Cara push schema jika `prisma db push` gagal (IPv6 tidak reachable)

**Opsi 1**: Buka Supabase Dashboard → **SQL Editor**, paste SQL berikut:

```sql
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
```

**Opsi 2**: Aktifkan **Supavisor** (connection pooler) di Project Settings → Database → Connection pooling, lalu gunakan session pooler connection string untuk `prisma db push` via IPv4.
