import { Router } from 'express';
import Restaurant from '../../../kafetery-server-admin/src/restaurants/restaurant.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true });
        res.status(200).json({ success: true, data: restaurants });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
