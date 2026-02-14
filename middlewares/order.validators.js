import { body } from "express-validator";

export const createOrderValidator = [
    body("products")
        .isArray({ min: 1 })
        .withMessage("Debe enviar al menos un producto"),

    body("products.*.product")
        .isMongoId()
        .withMessage("ID de producto inválido"),

    body("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser mayor a 0")
];
