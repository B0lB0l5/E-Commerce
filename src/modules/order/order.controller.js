import { Cart, Coupon, Order, Product } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { discountTypes, paymentMethods } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"
import { createCheckoutSession } from "../../utils/payment.js"

export const creatOrder = async (req, res, next) => {
    const { coupon, street, phone, paymentMethod } = req.body
    const user = req.authUser._id;


    let couponExists = null;
    if (coupon) {
        couponExists = await Coupon.findOne({ code: coupon })

        const currentDate = Date();
        if (!couponExists || currentDate < new Date(couponExists.fromDate) || currentDate > new Date(couponExists.toDate))
            return next(new AppError(messages.coupon.invalid, 409))


        if (coupon.assignedUsers?.length > 0 && !coupon.assignedUsers.includes(user)) {
            const isAssigned = couponExists.assignedUsers.includes(user);
            if (!isAssigned) {
                return next(new AppError(messages.coupon.notAssigned, 403));
            }
        }
    }

    const cart = await Cart.findOne({ user })
    const cartId = cart._id
    if (!cart) {
        return next(new AppError(messages.user.emptyCart, 400))
    }

    const products = cart.products
    let orderPrice = 0
    let finalPrice = 0
    let orderProducts = []

    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if (!productExist) {
            return next(new AppError(messages.product.notExist, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError(messages.product.stockNotEnough, 404))
        }
        orderPrice += productExist.finalPrice * product.quantity
        orderProducts.push({
            productId: productExist._id,
            price: productExist.price,
            finalPrice: productExist.finalPrice,
            quantity: product.quantity,
            discount: productExist.discount,
            name: productExist.name,
            mainImage: {
                secure_url: productExist.coverImage.secure_url,
                public_id: productExist.coverImage.public_id
            }
        })

    }

    if (couponExists) {
        if (couponExists.discountType == discountTypes.FIXED)
            finalPrice = Math.max(orderPrice - couponExists.discountAmount, 0);
        else {

            finalPrice = orderPrice - (orderPrice * (couponExists.discountAmount / 100));
            finalPrice = Math.max(finalPrice, 0);
        }
    } else {
        finalPrice = orderPrice;
    }

    const order = new Order({
        user,
        address: { phone, street },
        ...(couponExists && {
            coupon: couponExists._id,
            code: coupon,
            discount: couponExists.discountAmount
        }),
        paymentMethod,
        products: orderProducts,
        orderPrice,
        finalPrice

    })
    let payment = null
    if (paymentMethod === paymentMethods.CARD) {
        payment = await createCheckoutSession({ orderProducts, cartId })
    }

    const createdOrder = await order.save()

    return res.status(200).json({
        message: messages.order.createdSuccessfully,
        success: true,
        data: createdOrder,
        payment
    })
}



export const getAllOrders = async (req, res, next) => {
    const { productId } = req.params

    const orders = await Order.find({ "products.productId": productId })
    if (!orders)
        return next(new AppError(messages.order.notFound))

    return res.status(200).json({ success: true, data: orders })

}

export const myOrders = async (req, res, next) => {

    const orders = await Order.find({ user: req.authUser._id })
    if (!orders)
        return next(new AppError(messages.order.notFound))

    return res.status(200).json({ success: true, data: orders })

}