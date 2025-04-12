import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

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

export { userRegister };
