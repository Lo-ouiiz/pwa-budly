/*
  Warnings:

  - You are about to drop the column `firstName` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTraits` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `sizeCm` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `weightKg` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `zooDescription` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Sponsorship` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Zoo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Made the column `age` on table `Animal` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status` to the `Sponsorship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Zoo` table without a default value. This is not possible if the table is not empty.
  - Made the column `logo` on table `Zoo` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SponsorshipStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "firstName",
DROP COLUMN "personalityTraits",
DROP COLUMN "sizeCm",
DROP COLUMN "weightKg",
DROP COLUMN "zooDescription",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" DOUBLE PRECISION,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "story" DROP NOT NULL,
ALTER COLUMN "diet" DROP NOT NULL,
ALTER COLUMN "sponsorshipImpact" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "sponsorshipId" INTEGER;

-- AlterTable
ALTER TABLE "Sponsorship" DROP COLUMN "isActive",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "SponsorshipStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SponsorshipPlan" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zoo" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "logo" SET NOT NULL;

-- CreateTable
CREATE TABLE "PersonalityTrait" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "zooId" INTEGER NOT NULL,

    CONSTRAINT "PersonalityTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimalToPersonalityTrait" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimalToPersonalityTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "PersonalityTrait_zooId_idx" ON "PersonalityTrait"("zooId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityTrait_zooId_name_key" ON "PersonalityTrait"("zooId", "name");

-- CreateIndex
CREATE INDEX "_AnimalToPersonalityTrait_B_index" ON "_AnimalToPersonalityTrait"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_slug_key" ON "Animal"("slug");

-- CreateIndex
CREATE INDEX "Animal_zooId_idx" ON "Animal"("zooId");

-- CreateIndex
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");

-- CreateIndex
CREATE INDEX "Invoice_sponsorshipId_idx" ON "Invoice"("sponsorshipId");

-- CreateIndex
CREATE INDEX "Sponsorship_userId_idx" ON "Sponsorship"("userId");

-- CreateIndex
CREATE INDEX "Sponsorship_animalId_idx" ON "Sponsorship"("animalId");

-- CreateIndex
CREATE INDEX "Sponsorship_planId_idx" ON "Sponsorship"("planId");

-- CreateIndex
CREATE INDEX "SponsorshipPlan_zooId_idx" ON "SponsorshipPlan"("zooId");

-- CreateIndex
CREATE UNIQUE INDEX "Zoo_slug_key" ON "Zoo"("slug");

-- AddForeignKey
ALTER TABLE "PersonalityTrait" ADD CONSTRAINT "PersonalityTrait_zooId_fkey" FOREIGN KEY ("zooId") REFERENCES "Zoo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "Sponsorship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToPersonalityTrait" ADD CONSTRAINT "_AnimalToPersonalityTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToPersonalityTrait" ADD CONSTRAINT "_AnimalToPersonalityTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalityTrait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
