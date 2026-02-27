import { Router } from 'express';
import Promotion from '../../../kafetery-server-admin/src/promotions/promotion.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const promotions = await Promotion.find({ isActive: true });
        res.status(200).json({ success: true, data: promotions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
