/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Zoo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logo" TEXT,
    "labels" TEXT[],
    "photos" TEXT[],
    "description" TEXT NOT NULL,

    CONSTRAINT "Zoo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "photos" TEXT[],
    "species" TEXT NOT NULL,
    "subSpecies" TEXT,
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "conservationStatus" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "personalityTraits" TEXT[],
    "story" TEXT NOT NULL,
    "zooDescription" TEXT NOT NULL,
    "naturalHabitat" TEXT NOT NULL,
    "diet" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "sizeCm" DOUBLE PRECISION,
    "physicalSpecificity" TEXT,
    "lifeExpectancyYears" INTEGER,
    "sponsorshipImpact" TEXT NOT NULL,
    "zooId" INTEGER NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorshipPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "taxReducedPrice" DOUBLE PRECISION,
    "benefits" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "zooId" INTEGER NOT NULL,

    CONSTRAINT "SponsorshipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "monthlyAmount" DOUBLE PRECISION NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "animalId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_zooId_fkey" FOREIGN KEY ("zooId") REFERENCES "Zoo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorshipPlan" ADD CONSTRAINT "SponsorshipPlan_zooId_fkey" FOREIGN KEY ("zooId") REFERENCES "Zoo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SponsorshipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
