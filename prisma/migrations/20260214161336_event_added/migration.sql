/*
  Warnings:

  - You are about to drop the column `batch` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Event` table. All the data in the column will be lost.
  - Added the required column `candidateDeadline` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingEnd` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingStart` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "batch",
DROP COLUMN "createdBy",
DROP COLUMN "department",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "allowedBatch" TEXT,
ADD COLUMN     "allowedDept" TEXT,
ADD COLUMN     "candidateDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "votingEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "votingStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearRestriction" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
