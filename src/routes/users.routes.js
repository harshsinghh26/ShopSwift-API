import { Router } from 'express';
import { userLogin, userRegister } from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  userRegister,
);

router.route('/login').post(userLogin);

export default router;
