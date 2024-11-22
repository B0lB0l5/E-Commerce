import slugify from "slugify"
import { Brand, Product, Subcategory } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import cloudinary, { deleteCloudImage } from "../../utils/cloud.js"
import { ApiFeature } from "../../utils/apiFeature.js"

// add product
export const addProduct = async (req, res, next) => {
    // get data from req
    const {
        name , 
        description,
        stock, 
        price, 
        discount,
        discountTypes,
        colors, 
        sizes, 
        category, 
        subcategory,
        brand, 
    } = req.body

    // Check brand and subcategory existence 
    const brandExist = await Brand.findById(brand) // {}, null
    const subcategoryExist = await Subcategory.findById(subcategory)// {}, null
    if (!brandExist || !subcategoryExist) {
        return next(new AppError(
            !brandExist ? messages.brand.notFound : messages.subcategory.notFound, 
            404
        ));
    }

    // Upload cover image
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.coverImage[0].path, { folder: 'E-Commerce/products/cover-image'})
    let coverImage = {secure_url, public_id}

    // array of fail images
    req.failImages = []
    req.failImages.push(public_id)

    // Upload sub-images
    let subImages = []
    for (const file of req.files.subImages) { 
        const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder: 'E-Commerce/products/sub-images'})
        subImages.push({secure_url, public_id})
        req.failImages.push(public_id)
    };

    // prepare data
    const slug = slugify(name)
    const product = new Product({
        name,
        slug,
        description,
        stock, 
        price, 
        discount,
        discountTypes,
        colors: JSON.parse(colors), 
        sizes: JSON.parse(sizes), 
        category, 
        subcategory,
        brand,
        coverImage,
        subImages,
        createdBy: req.authUser._id
    })

    // add to db
    const createdProduct = await product.save()
    if(!createdProduct){
        req.failImages 
        return next(new AppError(messages.product.failToCreate, 500))
    }
    // send res 
    return res.status(201).json({
        message: messages.product.createdSuccessfully, 
        success: true, 
        data: createdProduct
    })
}

// get all products
export const getAllProducts = async (req, res, next) => {
    // let { page, size, sort, select, ...filter } = req.query

    // // this block of code = ...filter 
    // // let filter = JSON.parse(JSON.stringify(req.query))
    // // let exludedFields = ['sort', 'select', 'page', 'size']
    // // exludedFields.forEach(ele => {
    // //     delete filter[ele]
    // // })

    // filter = JSON.parse(JSON.stringify(filter).replace(/'gte|gt|lte|lt'/g, match => `$${match}`))

    // if( !page || page <= 0){
    //     page = 1
    // }
    // if( !size || size <= 0){
    //     size = 2
    // }
    // let skip = (page - 1) * size 
    // sort = sort?.replaceAll(',', ' ')
    // select = select?.replaceAll(',', ' ')

    // const products = await Product.find(filter).limit(size).skip(skip).sort(sort).select(select)

    const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
    const products  = await apiFeature.mongooseQuery
    // console.log(apiFeature.mongooseQuery);
    
    // console.log(products);
    
    return res.status(200).json({success: true, data: products})
}

// update product
export const updateProduct = async (req, res, next) => {
    // get data from req
    const {
        name,
        price,
        description,
        stock,
        discount,
        discountType,
        colors,
        sizes,
        brand,
        category,
        subcategory,
    } = req.body;
    const { productId } = req.params
    // check existance 
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    // 1- brand 
    if (brand) {
        const brandExist = await Brand.findById(brand)
        if (!brandExist) {
            return next(new AppError(messages.brand.notFound, 404))
        }
    }
    // 2- subcategory 
    if (subcategory) {
        const subcategoryExist = await Subcategory.findById(subcategory)
        if (!subcategoryExist) {
            return next(new AppError(messages.subcategory.notFound, 404))
        }
    }
    // upload image
    const oldFile = productExist.coverImage.public_id

    req.failImages = []
    let coverImage = productExist.coverImage
    if (req.files.coverImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
            public_id: oldFile,
            invalidate: "true"
        })
        coverImage = { secure_url, public_id }
        req.failImages.push(public_id)
    }

    let subImages = productExist.subImages

    if (req.files.subImages) {
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: 'E-commerce/products/sub-images'
            })
            subImages.push({ secure_url, public_id })
            req.failImages.push(public_id)
        }
    }
    // Prepare data
    if (name) {
        productExist.name = name;
        productExist.slug = slugify(name);
    }
    if (price) productExist.price = price;
    if (description) productExist.description = description;
    if (stock) productExist.stock = stock;
    if (discount) productExist.discount = discount;
    if (discountType) productExist.discountType = discountType;
    if (colors) productExist.colors = JSON.parse(colors);
    if (sizes) productExist.sizes = JSON.parse(sizes);
    if (brand) productExist.brand = brand;
    if (category) productExist.category = category;
    if (subcategory) productExist.subcategory = subcategory;
    // save to db
    const productUpdated = await productExist.save()
    
    // handel fail
    if (!productUpdated) {

        return next(new AppError(messages.product.failToUpdate, 500))
    }
    // Add the updatedBy field
    // productExist.updatedBy = req.authUser._id;
    // send res
    res.status(200).json({
        message: messages.product.updatedSuccessfully,
        success: true,
        data: productUpdated
    })
}

// get specific product
export const getProductById = async (req, res, next) => {
    // get data 
    const { productId } = req.params
    // check existacnce
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notExist, 404))
    }
    // send res 
    return res.status(200).json({
        message: messages.product.fetchedSuccessfully,
        success: true,
        data: productExist
    })
    
}

// delete product
export const deleteProduct = async (req, res, next) => {
    // get data from req
    const { productId } = req.params
    // check existance
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    // delete images from cloud 
    // 1- main imag
    if (productExist.coverImage) {
        await deleteCloudImage(productExist.coverImage.public_id)
    }
    // 2- sub images
    if (productExist.subImages?.length > 0) {
        for (const image of productExist.subImages) {
            await deleteCloudImage(image.public_id);
        }
    }
    // delete product from db
    await Product.findByIdAndDelete(productId)
    // send res 
    res.status(200).json({
        message: messages.product.deleted,
        success: true
    })
}
// // get product
// export const getAllProducts = async (req, res, next) => {
//     const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
//     const products = await apiFeature.mongooseQuery
//     // send res
//     return res.status(200).json({
//         message: messages.product.fetchedSuccessfully,
//         success: true,
//         data: products
//     })
// }