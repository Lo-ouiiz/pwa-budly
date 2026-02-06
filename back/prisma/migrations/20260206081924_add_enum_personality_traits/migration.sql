-- CreateEnum
CREATE TYPE "PersonalityTrait" AS ENUM ('Solitaire', 'Sociable', 'Affectueux', 'Territorial', 'Protecteur', 'Indépendant', 'Amical', 'Curieux', 'Paresseux', 'Energique', 'Joueur', 'Endormi', 'Timide', 'Audacieux', 'Colérique', 'Calme', 'Sensible', 'Méfiant', 'Joyeux', 'Drôle', 'Grognon', 'Mystérieux', 'Fier', 'Arrogant', 'Charmant', 'Majestueux');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "traits" "PersonalityTrait"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "traits" "PersonalityTrait"[];
