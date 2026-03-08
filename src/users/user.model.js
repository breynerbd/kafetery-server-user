'use strict';

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth_id: {
        type: String,
        required: [true, 'El auth_id es obligatorio'],
        trim: true,
        unique: true,
    },

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
    },

    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Correo no válido'],
    },

    role: {
        type: String,
        enum: ['CLIENT', 'RESTAURANT_ADMIN', 'PLATFORM_ADMIN'],
        default: 'CLIENT',
    },

    loyaltyPoints: {
        type: Number,
        default: 0,
        min: [0, 'Los puntos no pueden ser negativos'],
    },

    totalOrders: {
        type: Number,
        default: 0,
        min: [0, 'El total de órdenes no puede ser negativo'],
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

userSchema.index({ isActive: 1 });

export default mongoose.model('User', userSchema);