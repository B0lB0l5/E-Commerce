import Stripe from "stripe"


export const createCheckoutSession = async ({ orderProducts, cartId }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    let session = await stripe.checkout.sessions.create({
        success_url: 'https://google.com',
            cancel_url: 'https://facebook.com',
            payment_method_types: ['card'],
            mode: 'payment',
        client_reference_id: cartId.toString(),
        line_items: orderProducts.map(
            product => (
            {
                
                price_data: {
                    currency: 'egp',
                    unit_amount: product.finalPrice * 100,
                    product_data: {
                        name: product.name,
                        images: [product.mainImage.secure_url]
                    }
                },
                quantity: product.quantity
            })
        ),
        
    })

return session

}