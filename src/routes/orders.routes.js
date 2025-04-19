import { Router } from 'express';
import { verifyJWT } from '../middlewares/authc.middlewares.js';
import {
  getOrderDetails,
  placeOrder,
} from '../controller/orders.controller.js';

const router = Router();

router.route('/place-order').post(verifyJWT, placeOrder);
router.route('/get').get(verifyJWT, getOrderDetails);

export default router;
