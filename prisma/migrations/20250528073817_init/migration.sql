/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
-- For SQL Server, drop the existing default constraint and add a new one
-- First, find the name of the default constraint:
--   SELECT name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('User') AND parent_column_id = (
--     SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('User') AND name = 'isFirstTimeLogin'
--   );
-- Then, drop the constraint and add a new default:
--   ALTER TABLE "User" DROP CONSTRAINT [constraint_name];
--   ALTER TABLE "User" ADD DEFAULT 0 FOR "isFirstTimeLogin";

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otpExpires" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phoneNumber_key" ON "Otp"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
