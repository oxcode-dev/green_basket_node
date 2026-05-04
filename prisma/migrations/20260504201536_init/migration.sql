/*
  Warnings:

  - Added the required column `payment_reference` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_reference" TEXT NOT NULL,
ALTER COLUMN "payment_method" SET DEFAULT 'none';
