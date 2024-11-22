import slugify from "slugify";
import { Brand } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

// add brand
export const addBrand = async (req, res, next) => {
  //get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  //check existance
  const brandExist = await Brand.findOne({ name }); // {}, null
  if (brandExist) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  //prepare obj
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "E-Commerce/brand",
    }
  );
  // console.log(req.file);
    
  const slug = slugify(name);
  const brand = new Brand({
    name,
    slug,
    logo: { secure_url, public_id },
    createdby: req.authUser._id
  });
  //add to db
  const createdBrand = await brand.save();
  if (!createdBrand) {
    //rollback
    req.failImage = { secure_url, public_id };
    return next(new AppError(messages.brand.failToCreate, 500));
  }
  //send res
  return res.status(201).json({
    message: messages.brand.createdSuccessfully,
    success: true,
    data: createdBrand,
  });
};

// get all brands
export const getAllBrands = async (req, res, next) => {
  const brands = await Brand.find()
  return res.status(200).json({ success: true, data: brands });
};

// get a specific brand
export const getBrand = async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  return res.status(200).json({
    success: true,
    data: brand,
  });
};

// update brand
export const updateBrand = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  let { name } = req.body;
  name = name.toLowerCase();
  // check existance
  const brandExist = await Brand.findById(id);
  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  const nameExist = await Brand.findOne({ name, _id: { $ne: id } });
  if (nameExist) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  // prepare data
  if (name) {
    const slug = slugify(name);
    brandExist.name = name;
    brandExist.slug = slug;
  }
  // upload image
  if (req.file) {
    //delete old image
    await cloudinary.uploader.destroy(brandExist.logo.public_id);
    // upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "E-Commerce/brand",
      }
    );
    brandExist.logo = { secure_url, public_id };
  }
  // update to db
  const updatedBrand = await brandExist.save();
  if (!updatedBrand) {
    req.failimage = { secure_url, public_id };
    return next(new AppError(messages.brand.failToUpdate, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.brand.updatedSuccessfully,
    success: true,
    data: updatedBrand,
  });
};

// delete category
export const deleteBrand = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  // check existance
  const brandExist = await Brand.findById(id);
  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  //delete image
  if (brandExist.logo && brandExist.logo.public_id) {
    await cloudinary.uploader.destroy(brandExist.logo.public_id);
  }
  // delete from db
  const deletedBrand = await Brand.findByIdAndDelete(id);
  if (!deletedBrand) {
    return next(new AppError(messages.brand.failToDelete, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.brand.deletedSuccessfully,
    success: true,
    data: deletedBrand,
  });
};