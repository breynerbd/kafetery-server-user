import Order from "./order.model.js";
import Menu from "../menus/menu.model.js";
import Table from "../tables/table.model.js";
import User from "../users/user.model.js";
import Restaurant from "../restaurants/restaurant.model.js";
import PaymentMethod from "../paymentsMethod/payment.model.js";

export const getOrders = async (req, res) => {
    try {

        const authId = req.user.id;

        const user = await User.findOne({
            auth_id: authId
        });

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
            .populate("table", "tableNumber")
            .populate("paymentCard", "cardNumber brand cardHolder")
            .populate({
                path: "items.menu",
                select: "name price"
            });

        console.log("req.user:", req.user);
        console.log("authId:", req.user.id);

        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (err) {
        console.error("ERROR getOrders:", err);
        console.error(err.stack);

        console.log("req.user:", req.user);
        console.log("authId:", req.user.id);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const createOrder = async (req, res) => {
    try {

        const { restaurant, items, table } = req.body;

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

            if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

            if (menuItem.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${menuItem.name}`
                });
            }

            menuItem.stock -= item.quantity;

            if (menuItem.stock <= 0) {
                menuItem.stock = 0;
                menuItem.status = "OUT_OF_STOCK";
            }

            await menuItem.save();

            subtotal += menuItem.price * item.quantity;
        }

        if (table) {
            const tableData = await Table.findById(table);
            if (tableData) {
                tableData.status = 'OCCUPIED';
                await tableData.save();
            }
        }

        const discount = 0;
        const totalPrice = subtotal - discount;

        const order = new Order({
            user: user._id,
            restaurant,
            table,
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
};

export const deleteOrder = async (req, res) => {
    try {

        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);

        if (!order)
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });

        if (order.status === 'DELIVERED') {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar un pedido entregado'
            });
        }

        if (order.status === 'CANCELED') {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar un pedido cancelado'
            });
        }

        for (const item of order.items) {
            const menu = await Menu.findById(item.menu);
            menu.stock += item.quantity;
            menu.totalSold -= item.quantity;
            await menu.save();
        }

        if (order.table) {
            const table = await Table.findById(order.table);
            table.status = 'AVAILABLE';
            await table.save();
        }

        if (order.user) {
            const user = await User.findById(order.user);
            user.loyaltyPoints -= Math.floor(order.totalPrice / 10);
            user.totalOrders -= 1;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Pedido eliminado',
            data: order
        });

    } catch (err) {
        console.error(err);
        console.error(err.stack);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updatePaymentMethod = async (req, res) => {
    try {
        const authId = req.user.id;
        const { paymentMethod, paymentCard } = req.body;

        if (!["CASH", "CARD"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Método de pago inválido"
            });
        }

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({
                success: false,
                message: "Esta orden ya fue pagada."
            });
        }

        if (paymentMethod === "CARD") {
            if (!paymentCard) {
                return res.status(400).json({ success: false, message: "Debes seleccionar una tarjeta" });
            }

            try {
                const card = await PaymentMethod.findOne({
                    _id: paymentCard,
                    user: user._id
                });

                if (!card) {
                    return res.status(404).json({ success: false, message: "Tarjeta no encontrada" });
                }
                order.paymentCard = paymentCard;
            } catch (err) {
                console.error("Error al buscar tarjeta:", err);
                return res.status(400).json({ success: false, message: "ID de tarjeta inválido" });
            }
        } else {

            order.paymentCard = undefined;

        }

        order.paymentMethod = paymentMethod;

        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("restaurant", "name")
            .populate("table", "tableNumber")
            .populate("paymentCard", "cardNumber brand cardHolder")
            .populate({
                path: "items.menu",
                select: "name price"
            });

        return res.status(200).json({
            success: true,
            data: populatedOrder
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

export const completeOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada",
            });
        }

        if (order.status === "DELIVERED") {
            return res.status(400).json({
                success: false,
                message: "La orden ya ha sido entregada",
            });
        }

        if (order.table) {
            await Table.findByIdAndUpdate(order.table, {
                status: "AVAILABLE",
            });
        }

        const user = await User.findById(order.user);

        if (user) {
            user.loyaltyPoints += 4;
            user.totalOrders += 1;
            await user.save();
        }

        order.status = "DELIVERED";
        order.paymentStatus = "PAID";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Orden finalizada exitosamente",
            data: order,
            user: {
                loyaltyPoints: user.loyaltyPoints,
                totalOrders: user.totalOrders
            }
        });
    } catch (err) {
        console.log("ERROR COMPLETE ORDER:", err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const reviewOrder = async (req, res) => {
    try {
        const authId = req.user.id;
        const user = await User.findOne({ auth_id: authId });

        if (!user) return res.status(404).json({
            success: false,
            message: "Usuario no encontrado"
        });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json(
            {
                success: false,
                message: "Orden no encontrada"
            });

        if (!order.user.equals(user._id)) return res.status(403).json(
            {
                success: false,
                message: "No autorizado"
            });

        if (order.status !== "DELIVERED") return res.status(400).json(
            {
                success: false,
                message: "Orden no entregada"
            });

        if (order.reviewed) return res.status(400).json({
            success: false,
            message: "Ya calificada"
        });

        const { restaurantRating, restaurantComment, menus } = req.body;

        const restaurant = await Restaurant.findById(order.restaurant);
        if (!restaurant) return res.status(404).json({
            success: false,
            message: "Restaurante no encontrado"
        });

        restaurant.ratings.push({
            user: user._id,
            order: order._id,
            stars: restaurantRating,
            comment: restaurantComment
        });

        restaurant.totalRatings = restaurant.ratings.length;
        restaurant.averageRating = restaurant.ratings.reduce((sum, r) => sum + r.stars, 0) / restaurant.totalRatings;
        await restaurant.save();

        await Promise.all(menus.map(async (item) => {
            const menu = await Menu.findById(item.menu);
            if (menu) {
                menu.ratings.push({
                    user: user._id,
                    order: order._id,
                    stars: item.rating,
                    comment: item.comment
                });
                menu.totalRatings = menu.ratings.length;
                menu.averageRating = menu.ratings.reduce((sum, r) => sum + r.stars, 0) / menu.totalRatings;
                await menu.save();
            }
        }));

        order.reviewed = true;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Calificación enviada correctamente"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};