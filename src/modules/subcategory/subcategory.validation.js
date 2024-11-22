import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addsubcategoryValidation = joi.object({
    name: generalFields.name.required(),
    category: generalFields.objectId.required()
})

export const updateSubcategoryValidation = joi.object({
    name: generalFields.name,
    id : generalFields.objectId.required(), // Ensure id is allowed and required
    // category: generalFields.objectId.required()
});

export const deleteSubcategoryValidation = joi.object({
    id : generalFields.objectId.required(), // Ensure id is allowed and required
});