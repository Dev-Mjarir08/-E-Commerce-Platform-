import crypto from 'crypto';
import User from '../models/User.js';
import Store from '../models/Store.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.utils.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * Helper: Generate clean store slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Generate email verification token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : null,
      role: 'customer',
      verificationToken: hashedVerificationToken,
      verificationTokenExpire: verificationExpire,
      isVerified: false
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawVerificationToken}`;
    const emailMessage = `Welcome to Atelier Platform, ${user.name}! Please verify your email by opening: ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Atelier Account',
        message: emailMessage,
        link: verificationUrl,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e3df;">
            <h2 style="font-size: 20px; color: #111111; text-transform: uppercase;">Verify Your Atelier Account</h2>
            <p style="color: #666666;">Thank you for creating an account with Atelier Platform. Please confirm your email address to unlock full customer privileges.</p>
            <div style="margin: 25px 0;">
              <a href="${verificationUrl}" style="background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="color: #8e877f; font-size: 11px;">If you did not register for this account, please disregard this email.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Verification email delivery failure:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Customer registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          status: user.status
        },
        accessToken,
        refreshToken,
        ...(process.env.NODE_ENV === 'development' && { devVerificationToken: rawVerificationToken })
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during customer registration.'
    });
  }
};

/**
 * @desc    Register a new vendor/seller with their store
 * @route   POST /api/auth/vendor/register
 * @access  Public
 */
export const registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      storeName,
      storeDescription,
      storePhone,
      storeEmail,
      storeAddress
    } = req.body;

    if (!name || !email || !password || !storeName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user name, email, password, and store name.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Generate unique slug for the store
    let baseSlug = generateSlug(storeName);
    if (!baseSlug) baseSlug = `store-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Store.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate email verification token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user as seller/vendor
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : null,
      role: 'seller',
      verificationToken: hashedVerificationToken,
      verificationTokenExpire: verificationExpire,
      isVerified: false
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    await user.save();

    // Create associated Store
    const store = await Store.create({
      owner: user._id,
      name: storeName.trim(),
      slug: uniqueSlug,
      description: storeDescription || `Official storefront of ${storeName}`,
      email: storeEmail ? storeEmail.trim() : user.email,
      phone: storePhone ? storePhone.trim() : user.phone,
      address: storeAddress || {},
      status: 'pending' // pending administrative review or instant active
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawVerificationToken}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Atelier Vendor Account',
        message: `Welcome vendor partner! Please verify your email address: ${verificationUrl}`,
        link: verificationUrl
      });
    } catch (emailErr) {
      console.error('Vendor email delivery error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Vendor registration successful. Storefront created in pending review state.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          status: user.status
        },
        store: {
          id: store._id,
          name: store.name,
          slug: store.slug,
          description: store.description,
          status: store.status
        },
        accessToken,
        refreshToken,
        ...(process.env.NODE_ENV === 'development' && { devVerificationToken: rawVerificationToken })
      }
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during vendor registration.'
    });
  }
};

/**
 * @desc    Login user (Customer / Vendor / Admin)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Select password and refreshToken explicitly
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: `Your account has been ${user.status}. Please contact support.`
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // If user is seller/vendor, find their store
    let store = null;
    if (user.role === 'seller' || user.role === 'vendor') {
      store = await Store.findOne({ owner: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isVerified: user.isVerified,
          status: user.status
        },
        store: store
          ? {
              id: store._id,
              name: store.name,
              slug: store.slug,
              logo: store.logo,
              status: store.status
            }
          : null,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during login.'
    });
  }
};

/**
 * @desc    Logout user & invalidate refresh token
 * @route   POST /api/auth/logout
 * @access  Private / Public
 */
export const logout = async (req, res) => {
  try {
    // If authenticated via middleware
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out.'
    });
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    let store = null;
    if (user.role === 'seller' || user.role === 'vendor') {
      store = await Store.findOne({ owner: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isVerified: user.isVerified,
          status: user.status,
          createdAt: user.createdAt
        },
        store
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.'
    });
  }
};

/**
 * @desc    Forgot Password - Send reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond with success to protect user privacy
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been dispatched.'
      });
    }

    // Generate reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    const resetExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = resetExpire;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawResetToken}`;
    const emailText = `You requested a password reset for your Atelier account. Please click the link below within 30 minutes:\n\n${resetUrl}\n\nIf you did not make this request, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: emailText,
        link: resetUrl
      });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Unable to send password reset email. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been dispatched.',
      // In development, return the token for rapid API testing
      ...(process.env.NODE_ENV === 'development' && { devResetToken: rawResetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.'
    });
  }
};

/**
 * @desc    Reset Password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password, newPassword } = req.body;
    const incomingToken = token || req.query.token;
    const finalPassword = newPassword || password;

    if (!incomingToken) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required.'
      });
    }

    if (!finalPassword || finalPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(incomingToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.'
      });
    }

    // Set new password (pre-save hook hashes it)
    user.password = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during password reset.'
    });
  }
};

/**
 * @desc    Verify email address
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const incomingToken = token || req.query.token;

    if (!incomingToken) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(incomingToken).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() }
    }).select('+verificationToken +verificationTokenExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is invalid or has expired.'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email address has been successfully verified.'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during email verification.'
    });
  }
};

/**
 * @desc    Resend Email Verification
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address.'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already verified.'
      });
    }

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = hashedVerificationToken;
    user.verificationTokenExpire = verificationExpire;
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawVerificationToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Verify Your Atelier Account',
      message: `Please verify your email address: ${verificationUrl}`,
      link: verificationUrl
    });

    res.status(200).json({
      success: true,
      message: 'Verification email has been resent. Please check your inbox.',
      ...(process.env.NODE_ENV === 'development' && { devVerificationToken: rawVerificationToken })
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.'
    });
  }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;
    const token = incomingRefreshToken || req.headers['x-refresh-token'];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.'
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}.`
      });
    }

    // Verify against saved refresh token
    if (user.refreshToken && user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked or rotated.'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.'
    });
  }
};
