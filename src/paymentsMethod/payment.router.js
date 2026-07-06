import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

import {
    createPaymentMethod,
    getPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
} from "./payment.controller.js";

const router = Router();

router.post("/", authenticateUser, createPaymentMethod);

router.get("/", authenticateUser, getPaymentMethods);

router.get("/:id", authenticateUser, getPaymentMethodById);

router.put("/:id", authenticateUser, updatePaymentMethod);

router.delete("/:id", authenticateUser, deletePaymentMethod);

export default router;