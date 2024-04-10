import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { User } from "../models/user.js";
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(email);
  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "Email in use");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashPassword, avatarURL });

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription, avatarURL } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email or password is wrong");

  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) throw HttpError(401, "Email or password is wrong");

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json({ message: "Logout success" });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ message: "User subscription successful updated" });
};

const updateAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "file not found" });

  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const avatarPath = path.resolve("public", "avatar");
  const newPath = path.join(avatarPath, filename);
  const avatarURL = path.join("avatars", filename);

  Jimp.read(oldPath, (err, image) => {
    if (err) throw err;

    image.resize(250, 250).write(newPath);
  });

  await fs.rename(oldPath, newPath);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export const ctrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
