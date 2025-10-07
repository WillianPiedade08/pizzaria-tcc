/*
  Warnings:

  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cliente_id` on the `cliente` table. All the data in the column will be lost.
  - The primary key for the `itempedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `data_venda` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `forma_pagamento` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `pedido_id` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `preco_unitario` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `produto_id` on the `itempedido` table. All the data in the column will be lost.
  - You are about to drop the column `valor_total` on the `itempedido` table. All the data in the column will be lost.
  - The primary key for the `pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cliente_id` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `pedido_id` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `sub_total` on the `pedido` table. All the data in the column will be lost.
  - The primary key for the `produto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descricao` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `produto_id` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `qtd_estoque` on the `produto` table. All the data in the column will be lost.
  - You are about to alter the column `preco` on the `produto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to drop the `atendimento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `entrega` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fornecedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `funcionario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movimentoestoque` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Made the column `endereco` on table `cliente` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedidoId` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produtoId` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `atendimento` DROP FOREIGN KEY `Atendimento_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `atendimento` DROP FOREIGN KEY `Atendimento_funcionario_id_fkey`;

-- DropForeignKey
ALTER TABLE `entrega` DROP FOREIGN KEY `Entrega_fornecedor_id_fkey`;

-- DropForeignKey
ALTER TABLE `entrega` DROP FOREIGN KEY `Entrega_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `itempedido` DROP FOREIGN KEY `ItemPedido_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `itempedido` DROP FOREIGN KEY `ItemPedido_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `movimentoestoque` DROP FOREIGN KEY `MovimentoEstoque_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `Pedido_cliente_id_fkey`;

-- DropIndex
DROP INDEX `ItemPedido_pedido_id_fkey` ON `itempedido`;

-- DropIndex
DROP INDEX `ItemPedido_produto_id_fkey` ON `itempedido`;

-- DropIndex
DROP INDEX `Pedido_cliente_id_fkey` ON `pedido`;

-- AlterTable
ALTER TABLE `cliente` DROP PRIMARY KEY,
    DROP COLUMN `cliente_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nome` VARCHAR(191) NOT NULL,
    MODIFY `endereco` VARCHAR(191) NOT NULL,
    ALTER COLUMN `senha` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `itempedido` DROP PRIMARY KEY,
    DROP COLUMN `data_venda`,
    DROP COLUMN `forma_pagamento`,
    DROP COLUMN `item_id`,
    DROP COLUMN `nome`,
    DROP COLUMN `pedido_id`,
    DROP COLUMN `preco_unitario`,
    DROP COLUMN `produto_id`,
    DROP COLUMN `valor_total`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `pedidoId` INTEGER NOT NULL,
    ADD COLUMN `preco` DOUBLE NOT NULL,
    ADD COLUMN `produtoId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pedido` DROP PRIMARY KEY,
    DROP COLUMN `cliente_id`,
    DROP COLUMN `pedido_id`,
    DROP COLUMN `sub_total`,
    ADD COLUMN `clienteId` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `statusPagamento` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    ADD COLUMN `total` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `produto` DROP PRIMARY KEY,
    DROP COLUMN `descricao`,
    DROP COLUMN `produto_id`,
    DROP COLUMN `qtd_estoque`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nome` VARCHAR(191) NOT NULL,
    MODIFY `preco` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `atendimento`;

-- DropTable
DROP TABLE `entrega`;

-- DropTable
DROP TABLE `fornecedor`;

-- DropTable
DROP TABLE `funcionario`;

-- DropTable
DROP TABLE `movimentoestoque`;

-- CreateTable
CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `pessoas` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente',

    UNIQUE INDEX `Reserva_clienteId_key`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_email_key` ON `Cliente`(`email`);

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
