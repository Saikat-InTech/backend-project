import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

// Route: POST /api/v1/users/register
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),

  registerUser
);
router.route("/login").post(loginUser);

//secured route
router.route("logout").post(verifiyjwt, logoutUser);

export default router;
