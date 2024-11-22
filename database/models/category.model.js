import { model, Schema } from "mongoose";
//Schema
const categorySchema = new Schema({
    name : {
        type: String,
        unique: [true, 'Name is Required'],
        trim: true,
        required: true,
        lowercase: true,
        minlength: [2, 'Name of category is too short!']
    }, 
    slug : {
        type: String,
        lowercase: true,
        required: true,
    },
    image : Object,
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }
},{ timestamps: true, versionKey: false, toJSON: { virtuals: true }})
categorySchema.virtual('subcategories',{
    ref: "Subcategory",
    localField: "_id",
    foreignField: "category"
})
//Model
export const Category = model('Category', categorySchema)