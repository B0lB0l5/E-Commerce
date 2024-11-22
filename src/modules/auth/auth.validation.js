import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signupValidation = joi.object({
    name: generalFields.name.required(),
    email: generalFields.email.required(),
    phone: generalFields.phone.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
    DOB: generalFields.DOB

})

export const loginValidation = joi.object({
    phone: generalFields.phone.when('email',{
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
    email: generalFields.email,
    password: generalFields.password.required()
})