import { Cart } from '../models/cart.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/products.models.js';
import { ApiError } from '../utils/ApiError.js';

// add Items in Cart

const addItemsInCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const customerId = req.customer._id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found!');
  }

  const cartItem = await Cart.findOneAndUpdate(
    { customer: customerId, product: productId },
    {
      $inc: { quantity },
      $setOnInsert: {
        priceAtThatTime: product.price,
      },
    },
    { new: true, upsert: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cartItem, 'Product added to cart!'));
});

// Get Cart  Items and total Price

const getCart = asyncHandler(async (req, res) => {
  const customerId = req.customer._id;

  const cartItems = await Cart.find({ customer: customerId }).populate(
    'product',
    'name',
  );

  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(404, 'Cart is empty!');
  }

  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.quantity * item.priceAtThatTime;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: cartItems,
        totalPrice,
      },
      'Cart fetched successfully',
    ),
  );
});

export { addItemsInCart, getCart };
