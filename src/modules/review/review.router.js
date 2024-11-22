import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addReviewVal, deleteReviewValidation, getReviewsVal } from "./review.validation.js";
import { addReview, deleteReview, getReviews, getSpecificReview } from "./review.controller.js";

const reviewRouter = Router()

// add review
reviewRouter.post('/:productId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.USER]),
    isValid(addReviewVal),
    asyncHandler(addReview)
)

// get all review
reviewRouter.get('/:productId',
    isValid(getReviewsVal), // to do validation
    asyncHandler(getReviews)
)

// get specific review
reviewRouter.get('/:productId/:reviewId',
    isValid(getReviewsVal), 
    asyncHandler(getSpecificReview)
)

// delete review
reviewRouter.delete('/:productId/:reviewId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.USER]),
    isValid(deleteReviewValidation) , 
    asyncHandler(deleteReview)
)

export default reviewRouter;