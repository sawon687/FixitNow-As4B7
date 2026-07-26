/*
  Warnings:

  - The values [DECLINED,PAIDIN_PROGRESS] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,BANNED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionID` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Service` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('UNBAN', 'BAN');
ALTER TABLE "public"."Users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "Users" ALTER COLUMN "status" SET DEFAULT 'UNBAN';
COMMIT;

-- DropIndex
DROP INDEX "Payment_transactionID_key";

-- DropIndex
DROP INDEX "Review_bookingId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "method",
DROP COLUMN "transactionID";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "status" SET DEFAULT 'UNBAN';
