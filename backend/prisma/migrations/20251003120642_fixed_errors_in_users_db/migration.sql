/*
  Warnings:

  - A unique constraint covering the columns `[phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "phonenumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phonenumber_key" ON "public"."User"("phonenumber");
