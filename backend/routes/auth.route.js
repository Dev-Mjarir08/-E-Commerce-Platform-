import { Router } from 'express';
import {
  registerCustomer,
  registerVendor,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  createAdmin
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRouter = Router();

// Customer Registration
authRouter.post('/register', registerCustomer);

// Admin Registration
authRouter.post('/admin/register', createAdmin);
authRouter.post('/admin/create', createAdmin);

// Vendor Registration (Multi-Tenant)
authRouter.post('/vendor/register', registerVendor);


// Login & Logout
authRouter.post('/login', login);
authRouter.post('/logout', protect, logout);

// Current User Profile
authRouter.get('/me', protect, getMe);

// Password Management
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

// Email Verification
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/resend-verification', resendVerification);

// Token Refresh
authRouter.post('/refresh-token', refreshToken);

export default authRouter;