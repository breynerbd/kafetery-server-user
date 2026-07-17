'use strict';

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio'],
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio'],
    },

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
    },

    items: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: [true, 'El plato es obligatorio'],
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'Cantidad mínima 1'],
        },
    }],

    subtotal: {
        type: Number,
        min: [0, 'El subtotal debe ser mayor o igual a 0'],
    },

    discount: {
        type: Number,
        default: 0,
        min: [0, 'El descuento no puede ser negativo'],
    },

    totalPrice: {
        type: Number,
        min: [0, 'El total debe ser mayor o igual a 0'],
    },

    estimatedTime: {
        type: Number,
        min: [0, 'El tiempo estimado no puede ser negativo'],
    },

    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED'],
        default: 'PENDING',
    },

    paymentMethod: {
        type: String,
        enum: ["CASH", "CARD"],
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
    },

    paymentCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
    },

    reviewed: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

orderSchema.index({ isActive: 1 });
orderSchema.index({ restaurant: 1, status: 1 });

export default mongoose.model('Order', orderSchema);