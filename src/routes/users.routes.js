import { Router } from 'express';
import {
  userLogin,
  userLogout,
  userRegister,
} from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

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
router.route('/logout').post(verifyJWT, userLogout);

export default router;
