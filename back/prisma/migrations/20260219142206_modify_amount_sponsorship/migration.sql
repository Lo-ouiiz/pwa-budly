/*
  Warnings:

  - You are about to drop the column `monthlyAmount` on the `Sponsorship` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Sponsorship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sponsorship" DROP COLUMN "monthlyAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
