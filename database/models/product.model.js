import { model, Schema } from "mongoose";
import { discountTypes } from "../../src/utils/constant/enums.js";
//Schema
const productSchema = new Schema({
    name : {
        type: String,
        trim: true,
        required: true
    }, 
    slug : {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        min: 0,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
    },
    discountType: {
        type: String,
        enum: Object.values(discountTypes),
        default: discountTypes.PERCENTAGE
    },
    colors: [String],
    sizes: [String],
    coverImage: {
        secure_url: {type: String, required: true},
        public_id: {type: String, required: true}
    },
    subImages: [{
        secure_url: {type: String, required: true},
        public_id: {type: String, required: true}
    }],
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    subcategory: {type: Schema.Types.ObjectId, ref: 'Subcategory', required: true},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true}, 
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    rate: { 
        type: Number,
        default: 5,
        max: 5,
        min: 1
    }
},{ timestamps: true, versionKey: false})
// virtual
productSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * ((this.discount || 0) / 100))
})

productSchema.methods.inStock = function (quantity) {
    return this.stock < quantity ? false : true
}
//Model
export const Product = model('Product', productSchema)