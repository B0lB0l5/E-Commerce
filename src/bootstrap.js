// import categoryRouter from "./modules/category/category.router.js"

import { globalErrorHandling } from "./middleware/globalErrorHandling.js"
import cartRouter from "./modules/cart/cart.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import { authRouter, brandRouter, categoryRouter, productRouter, subcategoryRouter } from "./modules/index.js"
import orderRouter from "./modules/order/order.router.js"
import reviewRouter from "./modules/review/review.router.js"
import wishListRouter from "./modules/wishlist/wishlist.router.js"

export const bootstrap = (app, express) => {
    //parse req
    app.use(express.json())
    app.use('/uploads', express.static('uploads'))
    //routing
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product', productRouter)
    app.use('/auth', authRouter)
    app.use('/review', reviewRouter)
    app.use('/coupon', couponRouter)
    app.use('/wishList', wishListRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "Route not found " })
    })

    //globalErrorHandling
    app.use(globalErrorHandling)
}