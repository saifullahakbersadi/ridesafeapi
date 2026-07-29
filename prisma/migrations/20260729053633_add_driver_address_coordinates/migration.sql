/*
  Warnings:

  - You are about to drop the column `wwcc` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "destinationLat" DOUBLE PRECISION,
ADD COLUMN     "destinationLng" DOUBLE PRECISION,
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "estimatedArrival" TIMESTAMP(3),
ADD COLUMN     "estimatedTravelTime" INTEGER,
ADD COLUMN     "pickupLat" DOUBLE PRECISION,
ADD COLUMN     "pickupLng" DOUBLE PRECISION,
ADD COLUMN     "pickupPostcode" TEXT;

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "wwcc",
ADD COLUMN     "driverAddressLat" DOUBLE PRECISION,
ADD COLUMN     "driverAddressLng" DOUBLE PRECISION;
