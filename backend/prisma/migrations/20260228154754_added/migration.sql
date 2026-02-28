/*
  Warnings:

  - A unique constraint covering the columns `[complaint_id]` on the table `WorkAssigned` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."WorkAssigned_worker_id_complaint_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "WorkAssigned_complaint_id_key" ON "public"."WorkAssigned"("complaint_id");
