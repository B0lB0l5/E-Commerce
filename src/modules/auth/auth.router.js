import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { login, signup, verifyAccount } from "./auth.controller.js";
import { loginValidation, signupValidation } from "./auth.validation.js";

const authRouter = Router();


authRouter.post("/signup", isValid(signupValidation), asyncHandler(signup));

authRouter.get('/verify/:token', asyncHandler(verifyAccount));


authRouter.post('/login', isValid(loginValidation), asyncHandler(login))


export default authRouter;
