-- CreateTable
CREATE TABLE `Carro` (
    `id` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Carro_id_key`(`id`),
    UNIQUE INDEX `Carro_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
