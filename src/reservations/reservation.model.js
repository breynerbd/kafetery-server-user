'use strict';

import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
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
        required: [true, 'La mesa es obligatoria'],
    },

    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },

    time: {
        type: String,
        required: [true, 'La hora es obligatoria'],
    },

    people: {
        type: Number,
        required: [true, 'El número de personas es obligatorio'],
        min: [1, 'Debe haber al menos una persona'],
    },

    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'],
        default: 'PENDING',
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

reservationSchema.index({ isActive: 1 });
reservationSchema.index({ date: 1, restaurant: 1 });

export default mongoose.model('Reservation', reservationSchema);