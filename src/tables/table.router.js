import { Router } from "express";
import Table from "./table.model.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

const router = Router();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const { restaurantId } = req.query;
        const filter = { isActive: true };
        if (restaurantId) filter.restaurant = restaurantId;

        const tables = await Table.find(filter).sort({ tableNumber: 1 });
        res.status(200).json({ success: true, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
