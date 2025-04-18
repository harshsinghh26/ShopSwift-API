import { Cart } from '../models/cart.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/products.models.js';

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

export { addItemsInCart };
