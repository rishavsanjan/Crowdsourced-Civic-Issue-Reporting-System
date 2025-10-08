-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'user';
