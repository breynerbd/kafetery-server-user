import { Router } from "express";
import Order from "../../../server-admin/src/orders/order.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { userId, restaurantId, status } = req.query;
        const filter = {};
        if (userId) filter.user = userId;
        if (restaurantId) filter.restaurant = restaurantId;
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
