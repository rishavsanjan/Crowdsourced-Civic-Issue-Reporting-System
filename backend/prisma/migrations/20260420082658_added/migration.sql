/*
  Warnings:

  - You are about to drop the column `bert_category` on the `Complaint` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('central', 'departmental');

-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "bert_category",
ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "public"."WorkAssigned" ADD COLUMN     "adminId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'departmental',
    "department" "public"."Category" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."WorkAssigned" ADD CONSTRAINT "WorkAssigned_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
