import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createOrderVal, getOrdersVal } from "./order.validation.js";
import { creatOrder, getAllOrders, myOrders } from "./order.controller.js";
import { isValid } from "../../middleware/validation.js";

const orderRouter = Router()

orderRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(createOrderVal),
    asyncHandler(creatOrder)
)
orderRouter.get('/',
    isAuthenticated(),
    asyncHandler(myOrders)
)

orderRouter.get('/:productId',
    isValid(getOrdersVal),
    asyncHandler(getAllOrders)
)


export default orderRouter;