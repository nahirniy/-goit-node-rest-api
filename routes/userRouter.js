import express from "express";
import { createUserSchema, updateUserSubscShema } from "../models/user.js";
import { ctrl } from "../controllers/userControllers.js";
import validateBody from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(createUserSchema), ctrl.register);
userRouter.post("/login", validateBody(createUserSchema), ctrl.login);
userRouter.get("/current", authenticate, ctrl.getCurrent);
userRouter.post("/logout", authenticate, ctrl.logout);
userRouter.patch("/", authenticate, validateBody(updateUserSubscShema), ctrl.updateSubscription);
userRouter.patch("/avatars", upload.single("avatar"), authenticate, ctrl.updateAvatar);

export default userRouter;
