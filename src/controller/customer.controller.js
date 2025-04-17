import { response } from 'express';
import { Customer } from '../models/Customer.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

// Generate Token

const generateTokens = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    const accessToken = customer.generateAccessToken();
    const refreshToken = customer.generateRefreshToken();

    customer.refreshToken = refreshToken;
    await customer.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(error?.code, `${error}`);
  }
};

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

// Login Customer

const customerLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, 'Username or email is required!!');
  }
  const customer = await Customer.findOne({
    $or: [{ email }, { username }],
  });

  if (!customer) {
    throw new ApiError(404, 'Customer not Found!!');
  }
  const isPassword = await customer.isPasswordCorrect(password);

  if (!isPassword) {
    throw new ApiError(401, 'Wrong Password!!');
  }

  const { accessToken, refreshToken } = await generateTokens(customer._id);

  const loggedInCustomer = await Customer.findById(customer._id).select(
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
        {
          customer: loggedInCustomer,
          accessToken,
          refreshToken,
        },
        'User logged In Successfully!!',
      ),
    );
});

// Customer Logout

const customerLogout = asyncHandler(async (req, res) => {
  await Customer.findByIdAndUpdate(
    req.customer?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logout Successfully!!'));
});

// get Customer

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer?._id).select(
    '-password -refreshToken',
  );

  if (!customer) {
    throw new ApiError(401, 'Please login to find the customer!!');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, customer, 'Customer Fetched Successfully!!'));
});

export { customerRegister, customerLogin, customerLogout, getCustomer };
