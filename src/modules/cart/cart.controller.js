import { Cart, Product } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add to cart
export const addToCart = async (req, res, next) => {
    // get data from req
    const { productId, quantity } = req.body;
    const user = req.authUser._id;
    // check if product exists
    const productExist = await Product.findById(productId);
    if (!productExist) {
        return next(new AppError(messages.product.notExist, 404));
    }
    if (!productExist.inStock(quantity)) {
        return next(new AppError(messages.product.stockNotEnough, 404));
    }
    // check product in cart
    const ProductExistinCart = await Cart.findOneAndUpdate(
        { user, "products.productId": productId },
        { "products.$.quantity": quantity },
        { new: true }
    )
    let data = ProductExistinCart
    if (!ProductExistinCart) {
        // add product to cart
        const addedProduct = await Cart.findOneAndUpdate({ user }, {
            $push: { products: { productId, quantity } }
        }, { new: true })
        data = addedProduct
    }
    // send res 
    return res.status(200).json({
        message: messages.product.addedToCart,
        success: true,
        data
    })
}

// get cart
export const getCart = async (req, res, next) => {
    // get data from req
    const user = req.authUser._id;
    // get cart data
    const cart = await Cart.findOne({ user }).populate('products.productId', 'name price');
    // send res 
    return res.status(200).json({
        success: true,
        data: cart
    })
}

// delte product from cart
export const deleteProductFromCart = async (req, res, next) => {
    // get data from req
    const { productId } = req.params;
    const user = req.authUser._id;
    //
    const productinCartExist = await Cart.findOne({ user, "products.productId": productId })
    if (!productinCartExist) {
        return next(new AppError(messages.product.notExistInCart, 404));
    }
    // find and delte
    const updatedCart = await Cart.findOneAndUpdate(
        { user },
        { $pull: { products: { productId } } },
        { new: true }
    );
    // send res
    return res.status(200).json({
        message: messages.product.deletedFromCart,
        success: true,
        data: updatedCart
    })
}