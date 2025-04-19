import { Router } from 'express';
import { verifyJWT } from '../middlewares/authc.middlewares.js';
import { placeOrder } from '../controller/orders.controller.js';

const router = Router();

router.route('/place-order').post(verifyJWT, placeOrder);

export default router;
