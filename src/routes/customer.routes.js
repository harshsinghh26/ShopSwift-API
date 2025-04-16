import { Router } from 'express';
import { customerRegister } from '../controller/customer.controller.js';
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

export default router;
