import { Cart } from '../models/cart.models.js';
import { Order } from '../models/orders.models.js';
import { Product } from '../models/products.models.js';
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
  const user = await Product.findById(productId);

  const order = await Order.create({
    product: productId,
    customer: customerId,
    admin: user.createdBy,
    quantity,
    totalPrice: quantity * item.priceAtThatTime,
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

// Get order Details for customer

const getOrderDetails = asyncHandler(async (req, res) => {
  const customerId = req.customer._id;

  const orders = await Order.find({ customer: customerId }).populate(
    'product',
    'name',
  );

  if (!orders) {
    throw new ApiError(400, 'There is no Orders!!');
  }

  let allOrderPrice = 0;

  orders.forEach((items) => {
    allOrderPrice += items.totalPrice;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: orders, allOrderPrice },
        'All orders Fetched',
      ),
    );
});

// Get all Orders which the admin have

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'You are not Admin!!');
  }

  const orders = await Order.find({ admin: userId });

  if (!orders) {
    throw new ApiError(404, 'No Order are there');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, 'All Orders are Fetched Successfully!!'),
    );
});

export { placeOrder, getOrderDetails, getAllOrders };
