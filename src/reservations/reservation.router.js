import { Router } from "express";
import Reservation from "./reservation.model.js";
import Table from "../tables/table.model.js";
import User from "../users/user.model.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

const router = Router();

router.post('/', authenticateUser, async (req, res) => {

    try {

        const { table, restaurant, date, time, people } = req.body;

        const authId = req.user.id;

        const user = await User.findOne({ auth_id: authId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const tableData = await Table.findById(table);

        if (!tableData) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
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
            time,
            status: { $ne: "CANCELED" }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Table already reserved at this time"
            });
        }

        const reservation = new Reservation({
            user: user._id,
            restaurant,
            table,
            date,
            time,
            people
        });

        await reservation.save();

        tableData.status = "RESERVED";
        await tableData.save();

        res.status(201).json({
            success: true,
            data: reservation
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
});

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

        const reservations = await Reservation.find({
            user: user._id,
            isActive: true
        })
            .populate("table")
            .populate("restaurant", "name");

        res.status(200).json({
            success: true,
            data: reservations
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

router.put('/:id', authenticateUser, async (req, res) => {
    try {

        const { id } = req.params;
        const { table, restaurant, date, time, people } = req.body;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        const tableData = await Table.findById(table);

        if (!tableData) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
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
            time,
            status: { $ne: "CANCELED" },
            _id: { $ne: id }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Table already reserved at this time"
            });
        }

        reservation.table = table;
        reservation.restaurant = restaurant;
        reservation.date = date;
        reservation.time = time;
        reservation.people = people;

        await reservation.save();

        tableData.status = "RESERVED";
        await tableData.save();

        res.status(200).json({
            success: true,
            data: reservation
        });

        const tableDataOld = await Table.findById(reservation.table);

        if (tableDataOld) {
            tableDataOld.status = "AVAILABLE";
            await tableDataOld.save();
        }

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
});

router.delete('/:id', authenticateUser, async (req, res) => {
    try {

        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        reservation.isActive = false;
        await reservation.save();

        const tableData = await Table.findById(reservation.table);

        if (tableData) {
            tableData.status = "AVAILABLE";
            await tableData.save();
        }

        res.status(200).json({
            success: true,
            message: "Reservation deleted successfully"
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
});

export default router;