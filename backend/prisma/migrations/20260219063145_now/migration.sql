-- CreateEnum
CREATE TYPE "public"."WorkStatus" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "public"."Complaint" ADD COLUMN     "workerId" INTEGER;

-- CreateTable
CREATE TABLE "public"."WorkAssigned" (
    "id" SERIAL NOT NULL,
    "status" "public"."WorkStatus" NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "complaint_id" INTEGER NOT NULL,

    CONSTRAINT "WorkAssigned_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkAssigned_worker_id_complaint_id_key" ON "public"."WorkAssigned"("worker_id", "complaint_id");

-- AddForeignKey
ALTER TABLE "public"."WorkAssigned" ADD CONSTRAINT "WorkAssigned_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkAssigned" ADD CONSTRAINT "WorkAssigned_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "public"."Complaint"("complaint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
