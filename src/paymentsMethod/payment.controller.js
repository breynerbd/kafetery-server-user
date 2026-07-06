import PaymentMethod from "./payment.model.js";
import User from "../users/user.model.js";

export const createPaymentMethod = async (req, res) => {
    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const paymentMethod = new PaymentMethod({
            user: user._id,
            ...req.body
        });

        await paymentMethod.save();

        res.status(201).json({
            success: true,
            data: paymentMethod
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};

export const getPaymentMethods = async (req, res) => {

    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const cards = await PaymentMethod.find({
            user: user._id,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: cards
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const getPaymentMethodById = async (req, res) => {

    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const paymentMethod = await PaymentMethod.findOne({
            _id: req.params.id,
            user: user._id,
            isActive: true
        });

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Tarjeta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: paymentMethod
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const updatePaymentMethod = async (req, res) => {

    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const paymentMethod = await PaymentMethod.findOneAndUpdate(
            {
                _id: req.params.id,
                user: user._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Tarjeta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: paymentMethod
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const deletePaymentMethod = async (req, res) => {

    try {

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const paymentMethod = await PaymentMethod.findOneAndUpdate(
            {
                _id: req.params.id,
                user: user._id
            },
            {
                isActive: false
            },
            {
                new: true
            }
        );

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Tarjeta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Tarjeta eliminada"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};