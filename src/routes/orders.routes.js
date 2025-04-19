import { Router } from 'express';
import { verifyJWTCustomer } from '../middlewares/authc.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  getAllOrders,
  getOrderDetails,
  placeOrder,
} from '../controller/orders.controller.js';

const router = Router();

router.route('/place-order').post(verifyJWTCustomer, placeOrder);
router.route('/get').get(verifyJWTCustomer, getOrderDetails);
router.route('/admin/orders').get(verifyJWT, getAllOrders);

export default router;
