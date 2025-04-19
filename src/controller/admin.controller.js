import { Customer } from '../models/customer.models.js';
import { Order } from '../models/orders.models.js';
import { Product } from '../models/products.models.js';
import { User } from '../models/users.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const getallStats = asyncHandler(async (req, res) => {
  const totalUser = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomer = await Customer.countDocuments();
  const totalOrders = await Order.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Allusers: totalUser,
        AllProducts: totalProducts,
        AllCustomer: totalCustomer,
        AllOrders: totalOrders,
      },
      'All Stats fetched Successfully!!',
    ),
  );
});

export { getallStats };
