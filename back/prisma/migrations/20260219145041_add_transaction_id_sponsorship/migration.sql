/*
  Warnings:

  - Added the required column `transactionId` to the `Sponsorship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sponsorship" ADD COLUMN     "transactionId" TEXT NOT NULL;
