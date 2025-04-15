import { Router } from 'express';
import {
  chanegPassword,
  refreshTokens,
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
router.route('/refresh').post(verifyJWT, refreshTokens);
router.route('/change-password').put(verifyJWT, chanegPassword);
export default router;
