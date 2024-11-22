import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCategoryValidation = joi.object({
    name: generalFields.name.required()
})

export const updateCategoryValidation = joi.object({
    name: generalFields.name,
    id : generalFields.objectId.required(), // Ensure id is allowed and required

});

export const deleteCategoryValidation = joi.object({
    id : generalFields.objectId.required(), // Ensure id is allowed and required

});