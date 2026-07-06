import { Schema, model } from "mongoose";

const paymentMethodSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        cardHolder: {
            type: String,
            required: true,
            trim: true,
        },

        cardNumber: {
            type: String,
            required: true,
            minlength: 16,
            maxlength: 16,
        },

        cvv: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 4,
        },

        expiryMonth: {
            type: Number,
            required: true,
        },

        expiryYear: {
            type: Number,
            required: true,
        },

        brand: {
            type: String,
            enum: ["Visa", "Mastercard"],
            default: "Visa",
        },

        isDefault: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("PaymentMethod", paymentMethodSchema);