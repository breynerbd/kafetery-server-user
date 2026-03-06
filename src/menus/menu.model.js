'use strict';

import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del plato es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [300, 'La descripción no puede exceder 300 caracteres'],
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio debe ser mayor o igual a 0'],
    },

    stock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo'],
    },

    prepTime: {
        type: Number,
        default: 10,
        min: [1, 'El tiempo de preparación debe ser al menos 1 minuto'],
    },

    status: {
        type: String,
        enum: ['AVAILABLE', 'OUT_OF_STOCK', "INACTIVE"],
        default: 'AVAILABLE',
    },

    totalSold: {
        type: Number,
        default: 0,
    },

    availableFrom: {
        type: String, // "08:00"
    },

    availableTo: {
        type: String, // "22:00"
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio'],
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

menuSchema.index({ isActive: 1 });
menuSchema.index({ name: 1, restaurant: 1 });
menuSchema.index({ status: 1 });

export default mongoose.model('Menu', menuSchema);