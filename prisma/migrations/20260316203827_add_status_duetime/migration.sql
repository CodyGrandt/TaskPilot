-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "dueTime" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_STARTED';
