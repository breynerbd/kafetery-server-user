'use strict';

import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del restaurante es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Correo no válido'],
    },


    openingTime: {
        type: String, // "08:00"
        required: true
    },

    closingTime: {
        type: String, // "22:00"
        required: true
    },


    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ name: 1 });

export default mongoose.model('Restaurant', restaurantSchema);
