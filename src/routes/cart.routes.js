import { Router } from 'express';
import { verifyJWT } from '../middlewares/authc.middlewares.js';
import {
  addItemsInCart,
  deleteItems,
  getCart,
} from '../controller/cart.controller.js';

const router = Router();

router.route('/add').post(verifyJWT, addItemsInCart);
router.route('/get').get(verifyJWT, getCart);
router.route('/delete/:productId').patch(verifyJWT, deleteItems);

export default router;
