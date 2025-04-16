import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  createProduct,
  getProductById,
  getProducts,
  updateProductDetails,
  updateProductImage,
} from '../controller/products.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/create').post(
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),

  verifyJWT,
  createProduct,
);

router.route('/get-products').get(verifyJWT, getProducts);
router.route('/get-products/:id').get(verifyJWT, getProductById);
router.route('/update/:id').patch(verifyJWT, updateProductDetails);
router
  .route('/update-image/:id')
  .patch(upload.single('image'), verifyJWT, updateProductImage);

export default router;
