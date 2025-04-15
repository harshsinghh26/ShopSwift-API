import { Product } from '../models/products.models.js';
import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  if (
    [name, description, price, category, stock].some(
      (field) => field?.trim() === '',
    )
  ) {
    throw new ApiError(400, 'All Fields are Required!!');
  }

  const existingProduct = await Product.findOne({
    $and: [{ name }, { createdBy: req.user?._id }],
  });

  if (existingProduct) {
    throw new ApiError(409, 'Product are already exist with this user!!');
  }

  const imageFilePath = req.files?.image[0]?.path;

  if (!imageFilePath) {
    throw new ApiError(400, 'Image of Product is required!!');
  }

  const image = await uploadOnCloudinary(imageFilePath);

  if (!image) {
    throw new ApiError(
      500,
      'Something went wrong while uploading product Image, Please Upload it again!!',
    );
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    image: image.url,
    imageId: image.public_id,
    createdBy: user,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, product, 'Product Created Successsfully!!'));
});

export { createProduct };
