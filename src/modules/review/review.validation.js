import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addReviewVal = joi.object({
    comment: generalFields.comment.optional(),
    rate: generalFields.rate.required(),
    productId: generalFields.objectId.required()
})

export const getReviewsVal = joi.object({
    productId: generalFields.objectId.required(),
    size: joi.string().optional()
})

export const deleteReviewValidation = joi.object({
    id : generalFields.objectId.required(), 
});