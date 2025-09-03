/*
  Warnings:

  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cpf` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `cliente` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clienteId` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the `itempedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telefone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cliente_id` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente_id` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedido_id` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_total` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `itempedido` DROP FOREIGN KEY `ItemPedido_pedidoId_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `Pedido_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `telefone` DROP FOREIGN KEY `Telefone_clienteId_fkey`;

-- DropIndex
DROP INDEX `Cliente_cpf_key` ON `cliente`;

-- DropIndex
DROP INDEX `Cliente_email_key` ON `cliente`;

-- DropIndex
DROP INDEX `Pedido_clienteId_fkey` ON `pedido`;

-- AlterTable
ALTER TABLE `cliente` DROP PRIMARY KEY,
    DROP COLUMN `cpf`,
    DROP COLUMN `email`,
    DROP COLUMN `id`,
    ADD COLUMN `cliente_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `endereco` VARCHAR(100) NULL,
    ADD COLUMN `telefone` INTEGER NOT NULL,
    MODIFY `nome` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`cliente_id`);

-- AlterTable
ALTER TABLE `pedido` DROP PRIMARY KEY,
    DROP COLUMN `clienteId`,
    DROP COLUMN `id`,
    DROP COLUMN `total`,
    ADD COLUMN `cliente_id` INTEGER NOT NULL,
    ADD COLUMN `pedido_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `sub_total` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`pedido_id`);

-- DropTable
DROP TABLE `itempedido`;

-- DropTable
DROP TABLE `telefone`;

-- CreateTable
CREATE TABLE `Produto` (
    `produto_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `qtd_estoque` INTEGER NOT NULL,

    PRIMARY KEY (`produto_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item_Pedido` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `data_venda` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantidade` INTEGER NOT NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `forma_pagamento` VARCHAR(100) NOT NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `funcionario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cargo` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`funcionario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimentoEstoque` (
    `estoque_id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto_id` INTEGER NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `data_movimento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`estoque_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fornecedor` (
    `fornecedor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`fornecedor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entrega` (
    `entrega_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fornecedor_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `data_entrega` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`entrega_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Atendimento` (
    `atendimento_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `funcionario_id` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`atendimento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`cliente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_Pedido` ADD CONSTRAINT `Item_Pedido_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`pedido_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_Pedido` ADD CONSTRAINT `Item_Pedido_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`produto_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentoEstoque` ADD CONSTRAINT `MovimentoEstoque_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`produto_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrega` ADD CONSTRAINT `Entrega_fornecedor_id_fkey` FOREIGN KEY (`fornecedor_id`) REFERENCES `Fornecedor`(`fornecedor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrega` ADD CONSTRAINT `Entrega_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`produto_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Atendimento` ADD CONSTRAINT `Atendimento_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`cliente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Atendimento` ADD CONSTRAINT `Atendimento_funcionario_id_fkey` FOREIGN KEY (`funcionario_id`) REFERENCES `Funcionario`(`funcionario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
