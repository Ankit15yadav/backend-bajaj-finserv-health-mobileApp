-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "isFirstTimeLogin" BOOLEAN NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
