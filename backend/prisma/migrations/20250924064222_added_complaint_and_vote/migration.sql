-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('roads', 'streetlights', 'waste', 'water', 'parks', 'other');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'in_progress', 'resolved');

-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "public"."VoteType" AS ENUM ('like', 'dislike');

-- CreateTable
CREATE TABLE "public"."Complaint" (
    "complaint_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category" "public"."Category" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "bert_category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complaint_id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "media_id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" "public"."FileType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "vote_id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vote_type" "public"."VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("vote_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_complaint_id_user_id_key" ON "public"."Vote"("complaint_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "public"."Complaint"("complaint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "public"."Complaint"("complaint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
