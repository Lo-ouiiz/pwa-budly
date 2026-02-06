/*
  Warnings:

  - The values [ACTIVE,PAUSED,CANCELLED,EXPIRED] on the enum `SponsorshipStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `PersonalityTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimalToPersonalityTrait` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SponsorshipStatus_new" AS ENUM ('ACTIF', 'EN_PAUSE', 'ANNULE', 'EXPIRE');
ALTER TABLE "Sponsorship" ALTER COLUMN "status" TYPE "SponsorshipStatus_new" USING ("status"::text::"SponsorshipStatus_new");
ALTER TYPE "SponsorshipStatus" RENAME TO "SponsorshipStatus_old";
ALTER TYPE "SponsorshipStatus_new" RENAME TO "SponsorshipStatus";
DROP TYPE "public"."SponsorshipStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PersonalityTrait" DROP CONSTRAINT "PersonalityTrait_zooId_fkey";

-- DropForeignKey
ALTER TABLE "_AnimalToPersonalityTrait" DROP CONSTRAINT "_AnimalToPersonalityTrait_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnimalToPersonalityTrait" DROP CONSTRAINT "_AnimalToPersonalityTrait_B_fkey";

-- DropTable
DROP TABLE "PersonalityTrait";

-- DropTable
DROP TABLE "_AnimalToPersonalityTrait";
