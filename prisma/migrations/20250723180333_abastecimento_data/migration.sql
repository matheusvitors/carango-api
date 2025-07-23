/*
  Warnings:

  - Added the required column `data` to the `Abastecimento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `abastecimento` ADD COLUMN `data` DATETIME(3) NOT NULL;
