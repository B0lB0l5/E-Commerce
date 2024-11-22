import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addBrandValidation = joi.object({
    name: generalFields.name.required()
})

export const updateBrandValidation = joi.object({
    name: generalFields.name,
    id : generalFields.objectId.required(), // Ensure id is allowed and required

});

export const deleteBrandValidation = joi.object({
    id : generalFields.objectId.required(), // Ensure id is allowed and required
});