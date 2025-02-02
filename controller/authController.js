import { OTP } from "../model/OTP.js";
import { USER } from "../model/USER.js";
import { generateResetToken } from "../services/generateResetToken.js";
import { sendEmailResetLink } from "../utils/sendEmailResetLink.js";
import { sendOTPVerificationEmail } from "../utils/sendOTPVerificationEmail.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).send({
        status: "error",
        statusCode: 400,
        message: "Email and password are required.",
      });
    }

    const existingUser = await USER.findOne({ email }).select("+password");
    if (!existingUser) {
      return resp.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Invalid email or password.",
      });
    }

    if (!existingUser.isVerified) {
      return resp.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Your account is not verified.",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return resp.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Invalid email or password.",
      });
    }

    const token = await existingUser.generateAuthToken();
    resp.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    existingUser.lastLogin = Date.now();
    existingUser.save();
    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User logged in successfully.",
      data: {
        userId: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const registerUser = async (req, resp) => {
  try {
    const { lastName, firstName, email, password } = req.body;
    if (!email || !password) {
      return resp.status(400).send({
        status: "error",
        statusCode: 400,
        message: "Email and password are required.",
      });
    }
    const existingUser = await USER.findOne({ email });

    if (existingUser) {
      return resp.status(409).send({
        status: "failure",
        statusCode: 409,
        message: "User already exists.",
      });
    }

    const hashedPassword = await USER.hashPassword(password);

    const inputUser = new USER({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const savedUser = await inputUser.save();

    if (savedUser) {
      // send otp
      // await sendOTPVerificationEmail(savedUser._id, savedUser.email);

      return resp.status(200).send({
        status: "success",
        statusCode: 201,
        message: `Successfully sent OTP to your email ${savedUser.email}`,
        data: savedUser,
      });
    }
  } catch (error) {
    console.error(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export const verifyOTP = async (req, resp) => {
  try {
    const userId = await USER.findOne({ _id: req.body._id });
    userId.isVerified = true;
    await userId.save();
    if (userId) {
      resp.status(200).send({
        status: "success",
        statusCode: 200,
        message: "OTP and account successfully verified ",
        data: userId,
      });
    }
  } catch (error) {
    console.log(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const resendOTP = async (req, resp) => {
  try {
    const { _id } = req.body;
    const getUser = await USER.findOne({ _id });
    if (!getUser) {
      return resp.status(404).send({
        status: "error",
        statusCode: 404,
        message: "User not found.",
      });
    }
    await OTP.deleteMany({ userId: _id });
    sendOTPVerificationEmail(getUser._id, getUser.email);
    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Successfully resend OTP.",
    });
  } catch (error) {
    console.log(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const deleteAccount = async (req, resp) => {
  try {
    const deleteAccount = await USER.deleteOne({ email: req.body.email });
    resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "successfully delete account",
    });
  } catch (error) {
    console.error(error.message);
    resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export const getUser = async (req, resp) => {
  try {
    const existingUser = await USER.findOne({ _id: req.userId }).select(
      "-password"
    );

    if (!existingUser) {
      return resp.status(404).send({
        status: "failure",
        statusCode: 404,
        message: "User not found.",
      });
    }

    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User data retrieved successfully.",
      data: existingUser,
    });
  } catch (error) {
    console.error(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const forgetPassword = async (req, resp) => {
  const { email } = req.body;
  try {
    const existingUser = await USER.findOne({ email });
    if (!existingUser) {
      return resp.status(404).send({
        status: "error",
        statusCode: 404,
        message: "User not found.",
      });
    }

    const resetToken = await generateResetToken(existingUser.email);
    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpiry = Date.now() + 3600000;
    await existingUser.save();
    const resetLink = `
    http://localhost:3000/api/v1/verify-reset-token?token=${resetToken}`;

    const emailSubject = "Resend Password Reset Link";

    await sendEmailResetLink(existingUser.email, resetLink, emailSubject);
    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Password reset link sent to your email.",
      token: resetToken,
    });
  } catch (error) {
    console.log(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const resetPassword = async (req, resp) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    const { email } = JWT.verify(token, process.env.JWT_SECRET);

    const user = await USER.findOne({ email, resetToken: token });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return resp.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Password reset link is invalid or expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return resp.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error(error.message);

    if (error.name === "TokenExpiredError") {
      return resp.status(401).json({
        status: "failure",
        statusCode: 401,
        message: "Password reset link has expired. Please request a new link.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return resp.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Invalid password reset link.",
      });
    }

    return resp.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const resendResetPassword = async (req, resp) => {
  const { email } = req.body;
  try {
    const existingUser = await USER.findOne({ email });
    if (!existingUser) {
      return resp.status(404).send({
        status: "error",
        statusCode: 404,
        message: "User not found.",
      });
    }

    const resetToken = await generateResetToken(existingUser.email);
    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpiry = Date.now() + 3600000;
    await existingUser.save();
    const resetLink = `
    http://localhost:3000/api/v1/verify-reset-token?token=${resetToken}`;
    const emailSubject = "Resend Password Reset Link";

    await sendEmailResetLink(existingUser.email, resetLink, emailSubject);
    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Resend Password reset link sent to your email.",
      token: resetToken,
    });
  } catch (error) {
    console.log(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

export const logout = async (req, resp) => {
  try {
    const { _id } = req.params;

    const existingUser = await USER.findById({_id});
    if (!existingUser) {
      return resp.status(404).send({
        status: "failure",
        statusCode: 404,
        message: "User not found.",
      });
    }

    existingUser.lastLogout = Date.now();
    await existingUser.save();

    resp.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return resp.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};

