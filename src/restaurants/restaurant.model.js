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
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
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
        type: String,
        required: true
    },

    closingTime: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: true
            },
            stars: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comment: {
                type: String,
                trim: true,
                default: ""
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    averageRating: {
        type: Number,
        default: 0
    },

    totalRatings: {
        type: Number,
        default: 0
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
