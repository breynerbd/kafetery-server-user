'use strict';

import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'El código es obligatorio'],
        trim: true,
        maxLength: [50, 'El código no puede exceder 50 caracteres'],
    },

    title: {
        type: String,
        required: [true, 'El titúlo es obligatorio'],
        trim: true,
        maxLength: [100, 'El Titulo no puede exceder 100 caracteres'],
    },

    description: {
        type: String,
        trim: true,
        maxLength: [300, 'La descripción no puede exceder 300 caracteres'],
    },

    type: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED', '2x1', 'MIN_PURCHASE'],
        required: [true, 'El tipo de promoción es obligatorio'],
    },

    value: {
        type: Number,
        min: [0, 'El valor no puede ser negativo'],
    },

    minPurchase: {
        type: Number,
        min: [0, 'La compra mínima no puede ser negativa'],
    },

    maxUsesPerUser: {
        type: Number,
        min: [1, 'Debe permitir al menos un uso'],
    },

    validDays: [{
        type: String,
    }],

    startHour: {
        type: String,
    },

    endHour: {
        type: String,
    },

    applicableMenus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
    }],

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio'],
    },

    validFrom: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },

    validTo: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria'],
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

promotionSchema.index({ isActive: 1 });
promotionSchema.index({ code: 1, restaurant: 1 });

export default mongoose.model('Promotion', promotionSchema);