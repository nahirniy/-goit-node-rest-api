import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMoongoseError.js";

import Joi from "joi";

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subscriptionList = ["starter", "pro", "business"];

export const createUserSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().min(6).required(),
});

export const updateUserSubscShema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid(...subscriptionList),
});

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);
