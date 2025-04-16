import { Customer } from '../models/Customer.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

// Customer Register

const customerRegister = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() == '')
  ) {
    throw new ApiError(400, 'All field are required!!');
  }

  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { username }],
  });

  if (existingCustomer) {
    throw new ApiError(400, 'User Already Exist!!');
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

  const customer = await Customer.create({
    fullName,
    email,
    password,
    username,
    avatar: avatar?.url || '',
    avatarId: avatar?.public_id || '',
  });

  const createdCustomer = await Customer.findById(customer._id).select(
    '-password -refreshToken',
  );

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdCustomer, 'Customer Created Successfully!!'),
    );
});

export { customerRegister };
