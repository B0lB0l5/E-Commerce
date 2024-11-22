import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addProductValidation = joi.object({
    name : generalFields.name.required(),
    description: generalFields.description.required(),
    stock: generalFields.stock,
    price: generalFields.price.required(),
    discount:generalFields.discount,
    discountType: generalFields.discountTypes,
    colors: generalFields.colors,
    sizes: generalFields.sizes,
    category: generalFields.objectId.required(),
    subcategory: generalFields.objectId.required(),
    brand: generalFields.objectId.required()
})

export const updateProductVal = joi.object({
    name: generalFields.name,
    description: generalFields.description,
    stock: generalFields.stock,
    price: generalFields.price,
    discount: generalFields.discount,
    discountType: generalFields.discountTypes,
    colors: generalFields.colors,
    sizes: generalFields.sizes,
    productId: generalFields.objectId.required(),
    category: generalFields.objectId,
    subcategory: generalFields.objectId,
    brand: generalFields.objectId
})

export const deleteProductVal = joi.object({
    productId: generalFields.objectId.required()
})