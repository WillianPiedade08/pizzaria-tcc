/*
  Warnings:

  - You are about to drop the column `preco` on the `itempedido` table. All the data in the column will be lost.
  - Added the required column `precoUnitario` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itempedido` DROP COLUMN `preco`,
    ADD COLUMN `precoUnitario` DOUBLE NOT NULL;
