/*
  Warnings:

  - You are about to drop the column `adminId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `WorkAssigned` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkAssigned" DROP CONSTRAINT "WorkAssigned_adminId_fkey";

-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "public"."WorkAssigned" DROP COLUMN "adminId";
