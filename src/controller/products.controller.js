import { Product } from '../models/products.models.js';
import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

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

// Get All Products by user

const getProducts = asyncHandler(async (req, res) => {
  //   const user = await User.findById(req.user?._id);

  const containUser = await Product.findOne({
    createdBy: req.user?._id,
  });

  if (!containUser) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  const product = await Product.find({ createdBy: req.user?._id });

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched Successfully!!'));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const containUser = await Product.findOne({
    $and: [{ _id: id }, { createdBy: req.user?._id }],
  });

  if (!containUser) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  const product = await Product.findById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product for this Id has fetched!!'));
});

// Update Products Details

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, stock, price, category } = req.body;
  const { id } = req.params;

  const containUser = await Product.findOne({
    $and: [{ _id: id }, { createdBy: req.user?._id }],
  });

  if (!containUser) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  if (!(name || description || price || stock || category)) {
    throw new ApiError(400, 'All fields are Required!!');
  }

  const changeProductDetails = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        description,
        stock,
        price,
        category,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        changeProductDetails,
        'User Detail changed Successfully!!',
      ),
    );
});

// Change Product Image

const updateProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const containUser = await Product.findOne({
    $and: [{ _id: id }, { createdBy: req.user?._id }],
  });

  if (!containUser) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  const imageFilePath = req.file?.path;

  if (!imageFilePath) {
    throw new ApiError(400, 'Image of Product is required!!');
  }

  const image = await cloudinary.uploader.upload(imageFilePath, {
    public_id: containUser?.imageId,
    overwrite: true,
  });
  fs.unlinkSync(imageFilePath);

  if (!image?.url) {
    throw new ApiError(500, 'Something went wrong while uploading image!!');
  }

  const newImage = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        image: image.url,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, newImage, 'Product Image changed Successfully!!'),
    );
});

// Delete Product

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const containUser = await Product.findOne({
    $and: [{ _id: id }, { createdBy: req.user?._id }],
  });

  if (!containUser) {
    throw new ApiError(401, 'Unauthorize Access!!');
  }

  await cloudinary.uploader.destroy(containUser?.imageId);
  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Product Deleted Successfully!!'));
});

export {
  createProduct,
  getProducts,
  getProductById,
  updateProductDetails,
  updateProductImage,
  deleteProduct,
};
