import { model } from "mongoose";
import { Schema } from "mongoose";
import { status, paymentMethods } from "../../src/utils/constant/enums.js";

// schema 
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true },
            name: String,
            finalPrice: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            mainImage: {
                secure_url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        }
    ],
    address: {
        phone: String,
        street: String
    },
    paymentMethod: {
        type: String,
        enum: Object.values(paymentMethods),
        default: paymentMethods.CASH
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.PENDING
    },
    coupon: {
        couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
        discount: { type: Number },
        code: String
    },
    orderPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    }

}, { timestamps: true, versionKey: false })


// model 
export const Order = model('Order', orderSchema);