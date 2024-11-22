import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import {
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
} from "./category.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { cloudUploads } from "../../utils/multer_cloud.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const categoryRouter = Router();

//add category 
categoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  cloudUploads().single("image"),
  isValid(addCategoryValidation),
  asyncHandler(addCategory)
);

// get all categories
categoryRouter.get("/", asyncHandler(getAllCategories));

// get a specific category
categoryRouter.get("/:id", asyncHandler(getCategory));

// update category 
categoryRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  cloudUploads().single("image"),
  isValid(updateCategoryValidation),
  asyncHandler(updateCategory)
); 
// delete category 
categoryRouter.delete(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  isValid(deleteCategoryValidation),
  asyncHandler(deleteCategory)
);
export default categoryRouter;
