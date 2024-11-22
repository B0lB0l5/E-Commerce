import { Router } from "express"
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCouponVal, updateCouponVal } from "./coupon.validation.js";
import { addCoupon, deleteCoupon, getAllCoupon, getCouponById, updateCoupon } from "./coupon.controller.js";

const couponRouter = Router()

// add coupon
couponRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(addCouponVal),
    asyncHandler(addCoupon)
)

// update coupon
couponRouter.put('/:couponId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(updateCouponVal),
    asyncHandler(updateCoupon)
)

// get all coupon to admin 
couponRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(getAllCoupon)
)

// get specific coupon 
couponRouter.get('/:couponId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(getCouponById)
)

// delete coupon
couponRouter.delete('/:couponId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteCoupon)
)

export default couponRouter;