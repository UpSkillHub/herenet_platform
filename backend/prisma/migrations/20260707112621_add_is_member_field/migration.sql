-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isMember" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "User_isMember_idx" ON "User"("isMember");
