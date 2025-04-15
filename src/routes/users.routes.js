import { Router } from 'express';
import {
  changeAvatar,
  changePassword,
  changeUserDetails,
  getUser,
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
router.route('/change-password').put(verifyJWT, changePassword);
router.route('/profile').get(verifyJWT, getUser);
router.route('/change-details').patch(verifyJWT, changeUserDetails);
router
  .route('/change-avatar')
  .patch(upload.single('avatar'), verifyJWT, changeAvatar);
export default router;
