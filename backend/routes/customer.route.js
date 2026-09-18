import { Router } from 'express';
import {
  getCustomerProfile,
  updateCustomerProfile,
  changePassword
} from '../controllers/customer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);
router.put('/change-password', changePassword);

export default router;
