import bcrypt from "bcrypt";
import { Cart, User } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { generateToken, verifyToken } from "../../utils/token.js";
import { sendEmail } from "../../utils/email.js";
import { status } from "../../utils/constant/enums.js";

// signup
export const signup = async (req, res, next) => {
  // get data from req
  let { name, email, password, phone } = req.body;
  // check exitance
  const userExist = await User.findOne({ $or: [{ email }, { phone }] }); // {}, null
  if (userExist) return next(new AppError(messages.user.alreadyExist, 409));
  // prepare data
  // --hash password
  password = bcrypt.hashSync(password, 8);
  // --create user
  const user = new User({
    name,
    email,
    password,
    phone,
    status: status.OFFLINE, // Set initial status to OFFLINE
  });
  // add to database
  const createdUser = await user.save();
  if (!createdUser) return next(new AppError(messages.user.failToCreate, 500));
  // generate token
  const token = generateToken({ payload: { email, _id: createdUser._id } });
  const verifyUrl = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;
  // send email
  const emailContent = `
    <!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              background-color: #6f42c1;  /* Purple color */
              color: white;
              padding: 20px;
              border-radius: 10px 10px 0 0;
          }
          .header h1 {
              margin: 0;
          }
          .content {
              padding: 20px;
          }
          .content p {
              font-size: 16px;
              color: #333333;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              margin-top: 20px;
              background-color: #6f42c1;  /* Purple color */
              color: white;
              text-decoration: none;
              border-radius: 25px;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #5a34a1;  /* Darker purple on hover */
          }
          .footer {
              text-align: center;
              font-size: 14px;
              color: #888888;
              padding: 10px;
              margin-top: 20px;
              border-top: 1px solid #dddddd;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Email Verification</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>We're thrilled to have you with us! Please click the button below to verify your email address and activate your account:</p>
              <a href="${verifyUrl}" class="button">Verify Your Email</a>
              <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>© 2024 Our Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
  await sendEmail({
    to: email,
    subject: "please verify your account",
    html: emailContent,
  });
  // send res
  return res.status(201).json({
    message: messages.user.createdSuccessfully,
    success: true,
    data: createdUser,
  });
};

// verify account
export const verifyAccount = async (req, res, next) => {
  // get data from req
  const { token } = req.params;
  // check token
  const payload = verifyToken({ token });

  const user = await User.findOneAndUpdate(
    { email: payload.email, status: status.PENDING },
    { status: status.VERIFIED },
    { new: true }
  );
  // check user exist
  if (!user) return next(new AppError(messages.user.notFound, 404));
  // create card 
  await Cart.create({ user: user._id, products: [] })
  return res
    .status(200)
    .json({ message: messages.user.verified, success: true });
};

// login
export const login = async (req, res, next) => {
  // get data from req
  const { email, phone, password } = req.body;
  // check existance
  const userExist = await User.findOne({ $or: [{ email }, { phone }] });
  if (!userExist) return next(new AppError(messages.user.notFound, 400));
  // check password
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) return next(new AppError(messages.user.invalidCredentials, 400));
  // check if user is verified
  if (userExist.status !== status.VERIFIED) return next(new AppError(messages.user.notVerified, 401))
  // generate token
  const token = generateToken({payload: { _id: userExist._id, email: userExist.email }});
  // send res
  return res.status(200).json({
    message: "login Successfully",
    success: true,
    token,
  });
};
