/*
  Warnings:

  - Changed the type of `conservationStatus` on the `Animal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConservationStatus" AS ENUM ('NE', 'NA', 'DD', 'LC', 'NT', 'VU', 'EN', 'CR', 'RE', 'EW', 'EX');

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "conservationStatus",
ADD COLUMN     "conservationStatus" "ConservationStatus" NOT NULL;
