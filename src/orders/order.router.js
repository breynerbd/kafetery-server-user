import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

import {
    getOrders,
    createOrder,
    deleteOrder,
    updatePaymentMethod,
    completeOrder,
    reviewOrder,
} from "./order.controller.js";

const router = Router();

router.get("/", authenticateUser, getOrders);

router.post("/", authenticateUser, createOrder);

router.delete("/:id", authenticateUser, deleteOrder);

router.put("/:id/payment", authenticateUser, updatePaymentMethod);

router.put("/:id/complete", authenticateUser, completeOrder);

router.post("/:id/review", authenticateUser, reviewOrder);

export default router;