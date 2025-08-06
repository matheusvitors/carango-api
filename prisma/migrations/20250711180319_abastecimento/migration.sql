-- CreateTable
CREATE TABLE `Abastecimento` (
    `id` VARCHAR(191) NOT NULL,
    `kmInicial` INTEGER NOT NULL,
    `kmFinal` INTEGER NOT NULL,
    `litros` INTEGER NOT NULL,
    `precoCombustivel` INTEGER NOT NULL,
    `combustivel` VARCHAR(191) NOT NULL,
    `tipoCombustivel` VARCHAR(191) NOT NULL,
    `carroId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Abastecimento_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Abastecimento` ADD CONSTRAINT `Abastecimento_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `Carro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
