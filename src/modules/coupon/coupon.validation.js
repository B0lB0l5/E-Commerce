import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCouponVal = joi.object({
    code: generalFields.code.required(),
    discountAmount: generalFields.discountAmount.required(),
    discountType: generalFields.discountTypes,
    fromDate: generalFields.fromDate.required(),
    toDate: generalFields.toDate.required()
})
export const updateCouponVal = joi.object({
    couponId: generalFields.objectId.required(),
    code: generalFields.code.optional(),
    discountAmount: generalFields.discountAmount.optional(),
    discountType: generalFields.discountTypes,
    fromDate: generalFields.fromDate.optional(),
    toDate: generalFields.toDate.optional()
})