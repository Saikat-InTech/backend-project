import asyncHandler from "../utils/asyncHandler.js";
import JWT from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const verfiyJWT = asyncHandler(async (req, _ , next) => {
  try {
    const token =
      req.cookies?.accestoken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "unauthorized error");
    }
    const decodedtoken = JWT.verify(token, process.env.ACCES_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshtoken"
    );
    if (!user) {
      throw new ApiError(401, "invalid AccesToken");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "invalid accces token");
  }
});
export { verfiyJWT };
