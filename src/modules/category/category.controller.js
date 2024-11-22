// import { Category } from "../../../database/models/category.model.js"
import slugify from "slugify";
import { Category } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

//add category
export const addCategory = async (req, res, next) => {
  //get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  //check existance
  const categoryExist = await Category.findOne({ name }); // {}, null
  if (categoryExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "E-Commerce/category",
    }
  );

  //prepare data
  const slug = slugify(name);
  const category = new Category({
    name,
    slug,
    image: { secure_url, public_id },
    createdby: req.authUser._id
  });
  // add to db
  const createdCategory = await category.save();
  if (!createdCategory) {
    //rollback
    req.failImage = { secure_url, public_id };
    return next(new AppError(messages.category.failToCreate, 500));
  }
  //send res
  return res.status(201).json({
    meesage: messages.category.createdSuccessfully,
    success: true,
    data: createdCategory,
  });
};

// get all categories
export const getAllCategories = async (req, res, next) => {
  const categories = await Category.find().populate([
    { path: "subcategories" },
  ]);
  return res.status(200).json({ success: true, data: categories });
};

// get a specific category
export const getCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError(messages.category.notFound, 404));
  }
  return res.status(200).json({
    success: true,
    data: category,
  });
};

// get a specific category by name
//export const getCategoryByName = async (req, res, next) => {

//     const { name } = req.params; // Extract name from route parameters
//     console.log(req.params.name); // To check if 'name' is being passed correctly

//     if (!name) {
//         return next(new AppError('Category name is required', 400));
//     }
//     name = name.toLowerCase()

//     // Check if the name exists as a string (not an ID)
//     const category = await Category.findOne({ name })

//     if (!category) {
//         return next(new AppError('Category Not Found', 404));
//     }

//     // Return the category data along with its subcategories
//     return res.status(200).json({ success: true, data: category });

// };

// update category
export const updateCategory = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  let { name } = req.body;
  name = name.toLowerCase();
  // check existance
  const categoryExist = await Category.findById(id);
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  const nameExist = await Category.findOne({ name, _id: { $ne: id } });
  if (nameExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  if (name) {
    const slug = slugify(name);
    categoryExist.name = name;
    categoryExist.slug = slug;
  }
  // upload image
  if (req.file) {
    //delete old image
    await cloudinary.uploader.destroy(categoryExist.image.public_id);
    // upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "E-Commerce/category",
      }
    );
    categoryExist.image = { secure_url, public_id };
  }
  // update to db
  const updatedCategory = await categoryExist.save();
  if (!updateCategory) {
    req.failimage = { secure_url, public_id };
    return next(new AppError(messages.category.failToUpdate, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.category.updatedSuccessfully,
    success: true,
    data: updatedCategory,
  });
};

// delete category
export const deleteCategory = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  // check existance
  const categoryExist = await Category.findById(id);
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  // prepare data

  //delete image
  if (categoryExist.image && categoryExist.image.public_id) {
    await cloudinary.uploader.destroy(categoryExist.image.public_id);
  }
  // delete from db
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new AppError(messages.category.failToDelete, 409));
  }
  // send res
  return res.status(200).json({
    message: messages.category.deletedSuccessfully,
    success: true,
    data: deletedCategory,
  });
};

