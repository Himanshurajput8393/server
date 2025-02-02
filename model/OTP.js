import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "600" },
  },
  expiresAt: {
    type: Date,
    default: function () {
      return Date.now() + 600 * 1000;
    },
  },
});

otpSchema.indexes(
  { createdAt: 1 },
  { expireAfterSeconds: 600, background: true }
);

otpSchema.statics.hashOTP = async function (otp) {
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp.toString(), salt);
  return hashedOTP;
};


export const OTP = mongoose.model("Otp", otpSchema);
