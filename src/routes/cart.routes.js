import { Router } from 'express';
import { verifyJWTCustomer } from '../middlewares/authc.middlewares.js';
import {
  addItemsInCart,
  deleteItems,
  getCart,
} from '../controller/cart.controller.js';

const router = Router();

router.route('/add').post(verifyJWTCustomer, addItemsInCart);
router.route('/get').get(verifyJWTCustomer, getCart);
router.route('/delete/:productId').patch(verifyJWTCustomer, deleteItems);

export default router;
