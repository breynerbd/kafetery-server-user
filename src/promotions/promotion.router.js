import { Router } from 'express';
import Promotion from './promotion.model.js';
import { authenticateUser } from '../../middlewares/authenticateUser.js';

const router = Router();

router.get('/', authenticateUser, async (req, res) => {
    try {
        const promotions = await Promotion.find({ isActive: true });
        res.status(200).json({ success: true, data: promotions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
