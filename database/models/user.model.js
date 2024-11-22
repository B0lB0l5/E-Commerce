import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";
//schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.PENDING
    },
    image: {
        secure_url: { type: String, required: false },
        public_id: { type: String, required: false }
    },
    DOB: { type: String, default: Date.now() },
    wishList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });
//Model
export const User = model('User', userSchema)
