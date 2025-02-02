import express from "express";
import {
  deleteAccount,
  forgetPassword,
  getUser,
  loginUser,
  logout,
  registerUser,
  resendOTP,
  resendResetPassword,
  resetPassword,
  verifyOTP,
} from "../controller/authController.js";


import { authOTP } from "../middleware/authOTP.js";
import { authToken } from "../middleware/authToken.js";

export const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/verify-otp", authOTP, verifyOTP);
authRouter.post("/resend-otp", resendOTP);
authRouter.get("/me",authToken, getUser);
authRouter.post("/forget-password", forgetPassword);
authRouter.put("/reset-password",resetPassword);
authRouter.post("/resend-reset-password",resendResetPassword);
authRouter.post("/logout/:_id",logout);






authRouter.delete("/delete-account", deleteAccount);   // temporary APIs 
