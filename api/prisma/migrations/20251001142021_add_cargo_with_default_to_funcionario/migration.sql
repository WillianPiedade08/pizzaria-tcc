/*
  Warnings:

  - Added the required column `valor_total` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qtd_estoque` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `funcionario` ADD COLUMN `cargo` VARCHAR(191) NOT NULL DEFAULT 'Desconhecido';

-- AlterTable
ALTER TABLE `itempedido` ADD COLUMN `valor_total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `descricao` VARCHAR(191) NULL,
    ADD COLUMN `qtd_estoque` INTEGER NOT NULL;
