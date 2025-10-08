/*
  Warnings:

  - You are about to drop the column `created_at` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Vote" DROP COLUMN "created_at";
