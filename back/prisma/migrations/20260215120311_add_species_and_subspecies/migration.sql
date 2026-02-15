/*
  Warnings:

  - You are about to drop the column `species` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `subSpecies` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `speciesId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "species",
DROP COLUMN "subSpecies",
ADD COLUMN     "speciesId" INTEGER NOT NULL,
ADD COLUMN     "subSpeciesId" INTEGER;

-- CreateTable
CREATE TABLE "Species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubSpecies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,

    CONSTRAINT "SubSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_name_key" ON "Species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubSpecies_name_speciesId_key" ON "SubSpecies"("name", "speciesId");

-- CreateIndex
CREATE INDEX "Animal_speciesId_idx" ON "Animal"("speciesId");

-- CreateIndex
CREATE INDEX "Animal_subSpeciesId_idx" ON "Animal"("subSpeciesId");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_subSpeciesId_fkey" FOREIGN KEY ("subSpeciesId") REFERENCES "SubSpecies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSpecies" ADD CONSTRAINT "SubSpecies_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
