/*
  Warnings:

  - The `benefits` column on the `SponsorshipPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SponsorshipPlan" DROP COLUMN "benefits",
ADD COLUMN     "benefits" TEXT[];
