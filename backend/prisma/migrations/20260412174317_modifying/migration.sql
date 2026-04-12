-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Category" ADD VALUE 'ANIMAL_HUSBANDRY';
ALTER TYPE "public"."Category" ADD VALUE 'ELECTRICITY_AND_POWER_SUPPLY';
ALTER TYPE "public"."Category" ADD VALUE 'GARBAGE_AND_USANITARY_PRACTICES';
ALTER TYPE "public"."Category" ADD VALUE 'PARKS_AND_RECREATION';
ALTER TYPE "public"."Category" ADD VALUE 'POLLUTION';
ALTER TYPE "public"."Category" ADD VALUE 'PUBLIC_TOILETS';
ALTER TYPE "public"."Category" ADD VALUE 'PUBLIC_TRANSPORT';
ALTER TYPE "public"."Category" ADD VALUE 'ROADS_AND_FOOTPATHS';
ALTER TYPE "public"."Category" ADD VALUE 'SEWERAGE_SYSTEMS';
ALTER TYPE "public"."Category" ADD VALUE 'STREET_LIGHTING';
ALTER TYPE "public"."Category" ADD VALUE 'TRAFFIC_AND_ROAD_SAFETY';
ALTER TYPE "public"."Category" ADD VALUE 'TREES_AND_SAPLINGS';
ALTER TYPE "public"."Category" ADD VALUE 'WATER_SUPPLY_AND_SERVICES';
