import { Router } from "express";
import Order from "./order.model.js";
import Menu from "../menus/menu.model.js";
import Promotion from "../promotions/promotion.model.js";
import Table from "../tables/table.model.js";
import User from "../users/user.model.js";
import Restaurant from "../restaurants/restaurant.model.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

const router = Router();

router.get('/', authenticateUser, async (req, res) => {
    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const orders = await Order.find({
            user: user._id
        })
            .populate("user", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

router.post('/', authenticateUser, async (req, res) => {
    try {

        const { restaurant, items } = req.body;

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const restaurantData = await Restaurant.findById(restaurant);

        if (!restaurantData) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        let subtotal = 0;
        let estimatedTime = 0;

        for (const item of items) {

            const menuItem = await Menu.findById(item.menu);

            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: "Menu item not found"
                });
            }

            subtotal += menuItem.price * item.quantity;
            estimatedTime += menuItem.prepTime * item.quantity;
        }

        const discount = 0;
        const totalPrice = subtotal - discount;

        const order = new Order({
            user: user._id,
            restaurant,
            items,
            subtotal,
            discount,
            totalPrice,
            estimatedTime
        });

        await order.save();

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
});

export default router;