import { Router } from 'express';
import {
  uploadImage,
  uploadImages,
  deleteUploadedImage
} from '../controllers/upload.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import {
  uploadSingleImageMiddleware,
  uploadMultipleImagesMiddleware
} from '../middlewares/upload.middleware.js';

const uploadRouter = Router();

uploadRouter.use(protect);
uploadRouter.use(authorize('vendor', 'seller', 'admin', 'customer', 'user'));

// Single Image Upload
uploadRouter.post('/image', (req, res, next) => {
  uploadSingleImageMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadImage);

// Multiple Images Upload
uploadRouter.post('/images', (req, res, next) => {
  uploadMultipleImagesMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadImages);

// Delete Image
uploadRouter.delete('/image/:publicId', deleteUploadedImage);

export default uploadRouter;
