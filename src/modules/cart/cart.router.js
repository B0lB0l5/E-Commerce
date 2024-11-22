import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToCartVal, deleteProductFromCartVal } from "./cart.validation.js";
import { addToCart, deleteProductFromCart, getCart } from "./cart.controller.js";

const cartRouter = Router();

// update to cart
cartRouter.put('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(addToCartVal),
    asyncHandler(addToCart)
)

// get cart 
cartRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    asyncHandler(getCart)
)

// delte product from cart
cartRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(deleteProductFromCartVal),
    asyncHandler(deleteProductFromCart)
)

export default cartRouter;