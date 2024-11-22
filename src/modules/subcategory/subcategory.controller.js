import slugify from "slugify";
import { Category, Subcategory } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

// add subcategory
export const addsubcategory = async (req, res, next) => {
  // get data from body
  let { name, category } = req.body;
  name = name.toLowerCase();
  // check existance
  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  const subcategoryExist = await Subcategory.findOne({ name }); 
  if (subcategoryExist) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "E-Commerce/subcategory",
    }
  );
  //prepare data
  const slug = slugify(name);
  const subcategory = new Subcategory({
    name,
    slug,
    image: { secure_url, public_id },
    category,
    createdBy: req.authUser._id
  });
  const createdSubcategory = await subcategory.save();
  if (!createdSubcategory) {
    //rollback
    req.failImage = { secure_url, public_id };
    return next(new AppError(messages.subcategory.failToCreate, 500));
  }
  // send res
  return res.status(201).json({
    messages: messages.subcategory.createdSuccessfully,
    success: true,
    data: createdSubcategory
  })
};

// get all subcategories
export const getAllSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find()
  return res.status(200).json({ success: true, data: subcategories });
};

// get a specific suncategory
export const getSubcategory = async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  return res.status(200).json({
    success: true,
    data: subcategory,
  });
};

// update subcategory
export const updateSubcategory = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  let { name } = req.body;
  name = name.toLowerCase();
  // check existance
  const subcategoryExist = await Subcategory.findById(id);
  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  const nameExist = await Category.findOne({ name, _id: { $ne: id } });
  if (nameExist) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }
  // prepare data
  if (name) {
    const slug = slugify(name);
    subcategoryExist.name = name;
    subcategoryExist.slug = slug;
  }
  console.log(req.file.path)
  // upload image
  if (req.file) {
    //delete old image
    await cloudinary.uploader.destroy(subcategoryExist.image.public_id);
    // Check if the subcategory's image exists and has a public_id
    // if (subcategoryExist.image && subcategoryExist.image.public_id) 
    //   await cloudinary.uploader.destroy(subcategoryExist.image.public_id); // Delete old image 
    // upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      
      {
        folder: "E-Commerce/subcategory",
      }
    );
    subcategoryExist.image = { secure_url, public_id };
  }
  // update to db
  const updatedsubcategory = await subcategoryExist.save();
  if (!updatedsubcategory) {
    req.failimage = { secure_url, public_id };
    return next(new AppError(messages.subcategory.failToUpdate, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.subcategory.updatedSuccessfully,
    success: true,
    data: updatedsubcategory,
  });
};

// delete subcategory
export const deleteSubcategory = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  // check existance
  const subcategoryExist = await Subcategory.findById(id);
  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  //delete image
  if (subcategoryExist.image && subcategoryExist.image.public_id) {
    await cloudinary.uploader.destroy(subcategoryExist.image.public_id);
  }
  // delete from db
  const deletedSubcategory = await Subcategory.findByIdAndDelete(id);
  if (!deletedSubcategory) {
    return next(new AppError(messages.subcategory.failToDelete, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.subcategory.deletedSuccessfully,
    success: true,
    data: deletedSubcategory,
  });
};