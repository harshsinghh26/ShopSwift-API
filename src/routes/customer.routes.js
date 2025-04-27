import { Router } from 'express';
import {
  changeCustomerPassword,
  customerLogin,
  customerLogout,
  customerRegister,
  getCustomer,
  refreshTokens,
} from '../controller/customer.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTCustomer } from '../middlewares/authc.middlewares.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  customerRegister,
);

router.route('/login').post(customerLogin);
router.route('/logout').post(verifyJWTCustomer, customerLogout);
router.route('/profile').get(verifyJWTCustomer, getCustomer);
router.route('/change-password').put(verifyJWTCustomer, changeCustomerPassword);
router.route('/refresh').post(verifyJWTCustomer, refreshTokens);

export default router;
