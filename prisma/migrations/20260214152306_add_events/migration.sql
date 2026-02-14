/*
  Warnings:

  - You are about to drop the column `applicationDeadline` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `resultsPublished` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `votingEnd` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `votingStart` on the `Event` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "applicationDeadline",
DROP COLUMN "resultsPublished",
DROP COLUMN "votingEnd",
DROP COLUMN "votingStart",
ADD COLUMN     "batch" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
