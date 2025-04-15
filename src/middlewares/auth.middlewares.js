import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorize Access!!');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, 'Invailid token!!');
    }

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(error?.code, `${error}`);
  }
});

export { verifyJWT };
