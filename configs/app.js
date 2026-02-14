'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { corsOptions } from '../configs/cors-configuration.js';
import { dbConnection } from '../../server-admin/configs/db.js';
import { helmetConfiguration } from '../configs/helmet-configuration.js';
import { requestLimit } from '../configs/request-limit.js';
import { errorHandler } from '../configs/handle-errors.js';

import promotionRoutes from '../src/promotions/promotion.router.js';
import menuRoutes from '../src/menus/menu.router.js';
import tableRoutes from '../src/tables/table.router.js';
import orderRoutes from '../src/orders/order.router.js';
import reservationRoutes from '../src/reservations/reservation.router.js';

const BASE_URL = '/kafetery/user/v1';

const middlewares = (app) => {
    app.use(helmet(helmetConfiguration));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_URL}/promotions`, promotionRoutes);
    app.use(`${BASE_URL}/menus`, menuRoutes);
    app.use(`${BASE_URL}/tables`, tableRoutes);
    app.use(`${BASE_URL}/orders`, orderRoutes);
    app.use(`${BASE_URL}/reservations`, reservationRoutes);
};

const initServerUser = async () => {
    const app = express();
    const PORT = process.env.USER_PORT || 3002;

    try {
        await dbConnection();

        middlewares(app);
        routes(app);

        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({
                status: 'ok',
                service: 'kafetery User',
                version: '1.0.0'
            });
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Servidor USER corriendo en el puerto ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`);
        });

    } catch (error) {
        console.log(error);
    }
};

export { initServerUser };
