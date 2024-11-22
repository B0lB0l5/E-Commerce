import { Product, User } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add to wishList
export const addWishList = async (req, res, next) => {
    // get data from req 
    const { productId } = req.params;
    const userId = req.authUser._id;

    const productExists = await Product.findById(productId)
    if (!productExists)
        return next(new AppError(messages.product.notFound, 404))
    // add to db
    const userUpdated = await User.findByIdAndUpdate(userId,
        { $addToSet: { wishList: productId } },
        { new: true })
        
        if(!userUpdated){
            return next(new AppError(messages.user.failToUpdate, 404))
        }
    // send res
    return res.status(200).json({
        message: messages.wishList.updatedSuccessfully,
        success: true,
        data: userUpdated.wishList
    })
}

// get wishList
export const getWishList = async (req, res, next) => {
    // get data from req
    const userId = req.authUser._id;
    // get from db
    const user = await User.findById(userId)
    if (!user || !user.wishList) {
        return next(new AppError(messages.wishList.notFound, 404))
    }
    // send res
    return res.status(200).json({
        message: messages.wishList.fetchedSuccessfully,
        success: true,
        data: user.wishList
    })
}

// delete wishList
export const deleteWishList = async (req, res, next) => {
    // get data from req
    const { productId } = req.params;
    const userId = req.authUser._id;
    // check existence 
    const user = await User.findById(userId)
    if (!user.wishList.includes(productId)) {
        return next(new AppError(messages.product.notExist, 404))
    }
    // delete from db
    const userUpdated = await User.findByIdAndUpdate(userId, { $pull: { wishList: productId } }, { new: true })
    // send res
    return res.status(200).json({
        message: messages.wishList.deleted,
        success: true,
        data: userUpdated.wishList
    })
}
