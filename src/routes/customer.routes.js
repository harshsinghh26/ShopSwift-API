import { Router } from 'express';
import {
  customerLogin,
  customerRegister,
} from '../controller/customer.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

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

export default router;
