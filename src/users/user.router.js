import { Router } from "express";
import User from "./user.model.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
import { getInternalUser } from "../utils/getInternalUser.js";

const router = Router();

router.get('/points', authenticateUser, async (req, res) => {
    try {

        const { id: userId } = req.user;

        const user = await User.findOne({ auth_id: userId })
            .select("name email loyaltyPoints");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                points: user.loyaltyPoints || 0
            }
        });

    } catch (err) {
        console.error("Error getting points:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.get('/profile', authenticateUser, async (req, res) => {
    try {

        console.log("DEBUG | Datos en req.user:", req.user);

        const { id: userId, email, name } = req.user;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se encontró el ID de usuario en el token"
            });
        }

        const user = await getInternalUser(userId, email, name);

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                points: user.loyaltyPoints || 0
            }
        });

    } catch (err) {
        console.error("Error getting profile:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.put('/profile', authenticateUser, async (req, res) => {
    try {

        const { id: userId, email: tokenEmail } = req.user;
        const { name, email: bodyEmail } = req.body;

        const user = await getInternalUser(userId, tokenEmail);

        user.name = name || user.name;
        user.email = bodyEmail || tokenEmail;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                name: user.name,
                email: user.email,
                points: user.loyaltyPoints || 0
            }
        });

    } catch (err) {
        console.error("Error updating profile:", err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;