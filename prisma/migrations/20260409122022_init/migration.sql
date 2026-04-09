/*
  Warnings:

  - You are about to drop the column `user_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "user_id";
