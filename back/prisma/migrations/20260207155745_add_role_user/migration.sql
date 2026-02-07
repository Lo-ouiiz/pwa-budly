-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ZOO_ADMIN', 'ZOO_USER', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
