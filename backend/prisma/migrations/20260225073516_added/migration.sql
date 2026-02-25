-- AlterTable
ALTER TABLE "public"."WorkAssigned" ADD COLUMN     "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."JobEvidence" (
    "media_id" SERIAL NOT NULL,
    "workId" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" "public"."FileType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobEvidence_pkey" PRIMARY KEY ("media_id")
);

-- AddForeignKey
ALTER TABLE "public"."JobEvidence" ADD CONSTRAINT "JobEvidence_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."WorkAssigned"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
