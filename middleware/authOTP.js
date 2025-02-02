import { OTP } from "../model/OTP.js";
import bcrypt from "bcrypt";

export const authOTP = async (req, resp, next) => {
  try {
    const { otp } = req.body;
        if (!otp) {
          return resp.status(400).send({
            status: "failure",
            statusCode: 400,
            message: "OTP not found.",
          });
        }
    
        const getOTP = await OTP.findOne({ userId: req.body._id });
        if (!getOTP) {
          return resp.status(400).send({
            status: "failure",
            statusCode: 400,
            message: "OTP expired.",
          });
        }
    
        if (getOTP.expiresAt < Date.now()) {
          return resp.status(401).send({
            status: "failure",
            statusCode: 401,
            message: "OTP session expired.",
          });
        }
    
        const isValidOTP = await bcrypt.compare(otp, getOTP.otp);
    
        if (!isValidOTP) {
          return resp.status(401).send({
            status: "failure",
            statusCode: 401,
            message: "Unauthorized OTP.",
          });
        }
    next();
  } catch (error) {
    console.error(error.message);
    resp.status(500).send({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error.",
    });
  }
};
