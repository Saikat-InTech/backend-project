import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCouldinary } from "../utils/Cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadCouldinary(avatarLocalPath);
  const coverImage = coverLocalPath
    ? await uploadCouldinary(coverLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
const G_Access_And_Refresh_Token = async (userId) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const accessToken = user.generateAccessToken();
      console.log(accessToken);
      const refreshToken = user.generateRefreshToken();
      console.log(refreshToken);

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (err) {
      throw new ApiError(
        500,
        "Error generating access and refresh tokens",
        err
      );
    }
  };
const loginUser = asyncHandler(async (req, res) => {
  //req body
  //username and password is valid or not
  // if password is valid then check the password is correct
  //access and refresh token send user
  //// send cookie

  const { username, email, password } = req.body;
  console.log(username, email, password);
  if (!username && !email) {
    throw new ApiError(400, "User or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(user._id);
  if (!user) {
    throw new ApiError(404, "User Does Not Exist");
  }

  const ispasswordvalid = await user.isPasswordCorrect(password);
  if (!ispasswordvalid) {
    throw new ApiError(401, "invalid user credentials");
  }
  

  const { accessToken, refreshToken } = await G_Access_And_Refresh_Token(
    user._id
  );

  const loggedInuser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  const options = {
    httpOnlt: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accestoken", accessToken, options)
    .cookie("refreshtoken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInuser,
          refreshToken,
          accessToken,
        },
        "User logged in succes fully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // updated by new value
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accesToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // console.log("Cookies: ", req.cookies);
  // console.log("Body: ", req.body);
  // console.log("refreshToken in body:", req.body?.refreshToken);

  const incomingRefreshToken =
    req.cookies?.refreshtoken || req.body?.refreshtoken;

  console.log("Incoming Refresh Token:", incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request — refresh token missing");
  }

  

    const decodedToken = JWT.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
 console.log(decodedToken);
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log(user.refreshToken);

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token does not match or is expired");
  }

  const { refreshtoken, accestoken } = await G_Access_And_Refresh_Token(user._id);

  const options = {
    httpOnly: true,
   secure:true
  };

  return res
    .status(200)
    .cookie("accesToken", accestoken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken: accestoken, refreshToken: refreshtoken },
        "Access token refreshed successfully"
      )
    );
});


export { registerUser, loginUser, logoutUser, refreshAccessToken };
