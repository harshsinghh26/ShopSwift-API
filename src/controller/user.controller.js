import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Generate Tokens

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('Something went Wrong: ', error);
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are Required!!');
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User already Exist!!');
  }

  let avatarFilePath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarFilePath = req.files.avatar[0].path;
  }
  const avatar = await uploadOnCloudinary(avatarFilePath);

  const user = await User.create({
    fullName,
    email,
    username,
    password,
    avatar: avatar?.url || '',
    avatarId: avatar?.public_id || '',
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User register Successfully!!'));
});

// User Loggin

const userLogin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, 'email or username is required!!');
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, 'User not Found!!');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Wrong Password!!');
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User loggedIn Successfully!!',
      ),
    );
});

// User Logout

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out Successfully!!'));
});

// Refresh Token

const refreshTokens = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, 'Unauthorize Request!!');
  }

  const decodedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  if (!decodedToken) {
    throw new ApiError(401, 'Invalid Token');
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  //   const { accessToken, newRefreshToken } = await generateTokens(user._id);

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
    user._id,
  );
  //   console.log(newRefreshToken);

  user.refreshToken = newRefreshToken;
  user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: false,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { refreshToken: newRefreshToken, accessToken },
        'Token Refreshed Successfully!!',
      ),
    );
});

// Change User Password

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  const isPassword = await user.isPasswordCorrect(oldPassword);

  if (!isPassword) {
    throw new ApiError(401, 'Wrong old Password!!');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password Changed SuccessFully!!'));
});

// Get User

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select('-password');
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched Successfully!!'));
});

// Change user Details

const changeUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  if (!(fullName || email || username)) {
    throw new ApiError(400, 'All fields are required!!');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        username,
        email,
      },
    },
    { new: true },
  );

  const changedUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        changedUser,
        'User details are changed Successfully!!',
      ),
    );
});

// Change User Avatar

const changeAvatar = asyncHandler(async (req, res) => {
  const userId = await User.findById(req.user?._id);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized Access!!');
  }

  const avatarFilePath = req.file?.path;

  if (!avatarFilePath) {
    throw new ApiError(400, 'Avatar is required!!');
  }

  const avatar = await cloudinary.uploader.upload(avatarFilePath, {
    public_id: userId?.avatarId,
    overwrite: true,
  });

  fs.unlinkSync(avatarFilePath);

  if (!avatar?.url) {
    throw new ApiError(500, 'Something went wrong while uploading avatar!!');
  }

  const user = await User.findByIdAndUpdate(
    userId._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar Changed Successfully!!'));
});

export {
  userRegister,
  userLogin,
  userLogout,
  refreshTokens,
  changePassword,
  getUser,
  changeUserDetails,
  changeAvatar,
};
