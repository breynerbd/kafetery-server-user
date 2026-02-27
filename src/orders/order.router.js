import { Router } from "express";
import Order from "../../../kafetery-server-admin/src/orders/order.model.js";
import Menu from "../../../kafetery-server-admin/src/menus/menu.model.js";
import Table from "../../../kafetery-server-admin/src/tables/table.model.js";
import User from "../../../kafetery-server-admin/src/users/user.model.js";
import Restaurant from "../../../kafetery-server-admin/src/restaurants/restaurant.model.js";

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

router.post('/', async (req, res) => {
    try {
        const { user, restaurant, items, isDineIn } = req.body;

        const restaurantData = await Restaurant.findById(restaurant);
        if (!restaurantData) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < restaurantData.openHour || currentHour >= restaurantData.closeHour) {
            return res.status(400).json({
                success: false,
                message: "Restaurant is closed"
            });
        }

        let subtotal = 0;
        let estimatedTime = 0;

        for (const item of items) {
            const menuItem = await Menu.findById(item.menu);

            if (!menuItem || menuItem.stock <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Item unavailable: ${menuItem?.name}`
                });
            }

            subtotal += menuItem.price * item.quantity;
            estimatedTime += menuItem.prepTime;

            menuItem.stock -= item.quantity;
            menuItem.salesCount += item.quantity;

            if (menuItem.stock <= 0) {
                menuItem.status = "OUT_OF_STOCK";
            }

            await menuItem.save();
        }

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const validTransitions = {
            pending: ["CONFIRMED", "CANCELLED"],
            confirmed: ["PREPARING", "CANCELLED"],
            preparing: ["READY"],
            ready: ["DELIVERING"],
            delivered: [],
            cancelled: []
        };

        if (!validTransitions[order.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status transition"
            });
        }

        order.status = status;

        if (status === "DELIVERED" && order.table) {
            const table = await Table.findById(order.table);
            table.status = "AVAILABLE";
            await table.save();

            const user = await User.findById(order.user);
            user.points += Math.floor(order.total / 10);
            await user.save();
        }

        await order.save();

        res.status(200).json({ success: true, data: order });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

export default router;
