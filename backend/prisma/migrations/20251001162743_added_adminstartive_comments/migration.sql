/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vote` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AdminstrativeCommentType" AS ENUM ('internal', 'status', 'public');

-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Vote" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "public"."AdminstrativeComments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "public"."AdminstrativeCommentType" NOT NULL,

    CONSTRAINT "AdminstrativeComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AdminstrativeComments" ADD CONSTRAINT "AdminstrativeComments_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "public"."Complaint"("complaint_id") ON DELETE RESTRICT ON UPDATE CASCADE;
