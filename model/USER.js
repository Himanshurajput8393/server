import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        require: true,
        minlength: [3, "First Name must be at least 5 characters long"],
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      require: true,
      unique: true,
      minlength: [5, "Email must be at least 5 characters long"],
    },
    mobile: {
      type: Number,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "adocate", "user"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: {
        type: String,
      },
    },
    gender: {
      type: String,
      default: null,
      enum: ["male", "female", "transgender"],
    },
    bio: {
      type: String,
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "inactive",
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "process.env.JWT_SECRET", {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

export const USER = mongoose.model("user", userSchema);
