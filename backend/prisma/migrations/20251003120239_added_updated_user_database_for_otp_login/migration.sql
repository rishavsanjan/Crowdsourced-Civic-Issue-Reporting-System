-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phonenumber" INTEGER,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL;
