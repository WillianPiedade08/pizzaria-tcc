/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cliente_telefone_key` ON `Cliente`(`telefone`);
