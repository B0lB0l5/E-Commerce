import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { cloudUploads } from "../../utils/multer_cloud.js";
import { addBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "./brand.controller.js";
import { addBrandValidation, deleteBrandValidation, updateBrandValidation } from "./brand.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router()

//add brand 
brandRouter.post(
    '/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    cloudUploads().single('logo'),
    isValid(addBrandValidation),
    asyncHandler(addBrand)
)

// get all brands
brandRouter.get('/', asyncHandler(getAllBrands))

// get a specific brand
brandRouter.get('/:id', asyncHandler(getBrand))

//update brand 
brandRouter.put('/:id', 
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    cloudUploads().single("logo"),
    isValid(updateBrandValidation),
    asyncHandler(updateBrand)
)

// delete brand
brandRouter.delete('/:id', 
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    cloudUploads().single("logo"),
    isValid(deleteBrandValidation),
    asyncHandler(deleteBrand)
)


export default brandRouter