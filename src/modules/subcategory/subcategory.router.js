import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { fileUploads } from "../../utils/multer.js";
import {
  addsubcategoryValidation,
  deleteSubcategoryValidation,
  updateSubcategoryValidation,
} from "./subcategory.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  addsubcategory,
  deleteSubcategory,
  getAllSubcategories,
  getSubcategory,
  updateSubcategory,
} from "./subcategory.controller.js";
import { cloudUploads } from "../../utils/multer_cloud.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const subcategoryRouter = Router();

//add subcategory 
subcategoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  fileUploads({ folder: "subcategory" }).single("image"),
  isValid(addsubcategoryValidation),
  asyncHandler(addsubcategory)
);

// get all categories
subcategoryRouter.get("/", asyncHandler(getAllSubcategories));

// get a specific category
subcategoryRouter.get("/:id", asyncHandler(getSubcategory));

// update category 
subcategoryRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  cloudUploads().single("image"),
  isValid(updateSubcategoryValidation),
  asyncHandler(updateSubcategory)
);
// delete category 
subcategoryRouter.delete(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  isValid(deleteSubcategoryValidation),
  asyncHandler(deleteSubcategory)
);
export default subcategoryRouter;
