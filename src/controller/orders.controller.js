import { Cart } from '../models/cart.models.js';
import { Order } from '../models/orders.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const placeOrder = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const customerId = req.customer._id;

  const item = await Cart.findOne({
    customer: customerId,
    product: productId,
  });

  if (!item) {
    throw new ApiError(
      404,
      'Item not found in cart, Please add it in your cart first!!',
    );
  }

  const order = await Order.create({
    productId,
    customerId,
    quantity,
    priceAtThatTime: item.price,
  });

  if (item.quantity == 1) {
    await Cart.deleteOne({ _id: item._id });
  } else {
    await Cart.findByIdAndUpdate(
      item._id,
      {
        $inc: {
          quantity: -order.quantity,
        },
      },
      { new: true },
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        order,
        "Order Placed Successfully!! It'll Deliverd in 2 Days!!",
      ),
    );
});

export { placeOrder };
