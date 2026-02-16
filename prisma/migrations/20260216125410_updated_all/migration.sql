/*
  Warnings:

  - The `status` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EventPhase" AS ENUM ('APPLICATION', 'VERIFICATION', 'VOTING', 'CLOSED');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "status",
ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "status",
ADD COLUMN     "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "status",
ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "phase" "EventPhase" NOT NULL DEFAULT 'APPLICATION';

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_eventId_key" ON "Candidate"("userId", "eventId");

-- CreateIndex
CREATE INDEX "OTP_email_idx" ON "OTP"("email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
