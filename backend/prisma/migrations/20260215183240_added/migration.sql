/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Worker_phoneNumber_key" ON "public"."Worker"("phoneNumber");
