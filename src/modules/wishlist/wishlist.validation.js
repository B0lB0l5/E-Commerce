import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addWishListVal = joi.object({
    productId: generalFields.objectId.required()
})
export const deleteWishListVal = joi.object({
    productId: generalFields.objectId.required()
})