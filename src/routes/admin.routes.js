import { Router } from 'express';
import { getallStats } from '../controller/admin.controller.js';

const router = Router();

router.route('/stats').get(getallStats);

export default router;
