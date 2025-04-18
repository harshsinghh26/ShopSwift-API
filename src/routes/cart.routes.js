import { Router } from 'express';
import { verifyJWT } from '../middlewares/authc.middlewares.js';
import { addItemsInCart, getCart } from '../controller/cart.controller.js';

const router = Router();

router.route('/add').post(verifyJWT, addItemsInCart);
router.route('/get').get(verifyJWT, getCart);

export default router;
