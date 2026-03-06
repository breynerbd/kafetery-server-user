'use strict';

import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: [true, 'El número de mesa es obligatorio'],
        min: [1, 'El número debe ser mayor a 0'],
    },

    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [1, 'La capacidad debe ser al menos 1 persona'],
    },

    status: {
        type: String,
        enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'],
        default: 'AVAILABLE',
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'La mesa debe pertenecer a un restaurante'],
    },

    isActive: {
        type: Boolean,
        default: true,
    },
});

tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ isActive: 1 });

export default mongoose.model('Table', tableSchema);