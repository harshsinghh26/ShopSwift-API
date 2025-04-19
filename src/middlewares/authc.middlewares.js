import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Customer } from '../models/customer.models.js';

const verifyJWTCustomer = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorize Access!!');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new ApiError(401, 'Unauthorize Access!!');
    }

    const customer = await Customer.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    req.customer = customer;
    next();
  } catch (error) {
    throw new ApiError(error?.code, `${error}`);
  }
});

export { verifyJWTCustomer };
