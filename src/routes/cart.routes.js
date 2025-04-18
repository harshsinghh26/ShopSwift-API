import { Router } from 'express';
import { verifyJWT } from '../middlewares/authc.middlewares.js';
import { addItemsInCart } from '../controller/cart.controller.js';

const router = Router();

router.route('/add').post(verifyJWT, addItemsInCart);

export default router;
