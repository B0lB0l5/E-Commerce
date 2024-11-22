import { Router } from "express";
import { cloudUploads } from "../../utils/multer_cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductValidation, deleteProductVal, updateProductVal } from "./product.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router()

// add product 
productRouter.post('/',
    cloudUploads().fields([{name: 'coverImage', maxCount: 1}, {name: 'subImages', maxCount: 5}]),
    isValid(addProductValidation),
    asyncHandler(addProduct)
)
productRouter.get('/', asyncHandler(getAllProducts))

// update product 
productRouter.put('/:productId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUploads().fields([{ name: 'coverImage', maxCount: 1 }, { name: 'subImages', maxCount: 5  }]),
    isValid(updateProductVal),
    asyncHandler(updateProduct)
)

// get specific product 
productRouter.get('/:productId', asyncHandler(getProductById))

// delete producr 
productRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    isValid(deleteProductVal),
    asyncHandler(deleteProduct)
)


export default productRouter