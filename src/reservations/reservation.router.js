import { Router } from 'express';
import Reservation from '../../../server-admin/src/reservations/reservation.model.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json({ success: true, data: reservation });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find({ isActive: true });
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
