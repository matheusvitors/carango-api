/*
  Warnings:

  - Added the required column `usuarioId` to the `Carro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carro` ADD COLUMN `usuarioId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Carro` ADD CONSTRAINT `Carro_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
