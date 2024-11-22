import { model, Schema } from "mongoose";
//Schema
const subcategorySchema = new Schema({
    name : {
        type: String,
        unique: [true, 'Name is Required'],
        trim: true,
        required: true,
        minlength: [2, 'Name of category is too short!']
    }, 
    image : Object,
    slug : {
        type: String,
        lowercase: true,
        required: true
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    ratAvg: {
        type: Number,
        min: 0,
        max: 5
    },
    ratCount: Number,
},{ timestamps: true, versionKey: false})
//Model
export const Subcategory = model('Subcategory', subcategorySchema)