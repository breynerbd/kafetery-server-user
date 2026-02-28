import { Router } from "express";
import User from "../../../kafetery-server-admin/src/users/user.model.js";

const router = Router();

router.get('/points/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("name email points");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                points: user.points || 0
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
