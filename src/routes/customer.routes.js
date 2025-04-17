import { Router } from 'express';
import {
  changeCustomerPassword,
  customerLogin,
  customerLogout,
  customerRegister,
  getCustomer,
} from '../controller/customer.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/authc.middlewares.js';

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
router.route('/logout').post(verifyJWT, customerLogout);
router.route('/profile').get(verifyJWT, getCustomer);
router.route('/change-password').put(verifyJWT, changeCustomerPassword);

export default router;
