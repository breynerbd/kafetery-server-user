import { Router } from 'express';
import Menu from '../../../kafetery-server-admin/src/menus/menu.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const menus = await Menu.find({ isActive: true });
        res.status(200).json({ success: true, data: menus });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
