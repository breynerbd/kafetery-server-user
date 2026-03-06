import { Router } from 'express';
import Reservation from './reservation.model.js';
import Table from '../tables/table.model.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { table, date, startTime, endTime, people } = req.body;

        const tableData = await Table.findById(table);

        if (!tableData) {
            return res.status(404).json({ success: false, message: "Table not found" });
        }

        if (people > tableData.capacity) {
            return res.status(400).json({
                success: false,
                message: "Exceeds table capacity"
            });
        }

        const conflict = await Reservation.findOne({
            table,
            date,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Time conflict for this table"
            });
        }

        const reservation = new Reservation(req.body);
        await reservation.save();

        tableData.status = "RESERVED";
        await tableData.save();

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
