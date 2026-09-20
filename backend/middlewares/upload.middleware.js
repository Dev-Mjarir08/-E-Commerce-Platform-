import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const productUploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const categoryUploadDir = path.join(__dirname, '../uploads/categories');
if (!fs.existsSync(categoryUploadDir)) {
  fs.mkdirSync(categoryUploadDir, { recursive: true });
}

const avatarUploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

// Configure disk storage for products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `prod-${uniqueSuffix}${ext}`);
  }
});

// Configure disk storage for categories
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cat-${uniqueSuffix}${ext}`);
  }
});

// Configure disk storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, AVIF) are allowed!'), false);
  }
};

export const uploadProductMedia = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 1 }
]);

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter
}).single('image');

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter
}).single('avatar');

/**
 * Utility helper to delete an image file from disk / Cloudinary
 * @param {string} imagePathOrUrl - Local path or URL
 * @param {string} publicId - Optional Cloudinary public_id
 */
export const removeImageFile = async (imagePathOrUrl, publicId = null) => {
  try {
    // If public_id is provided and cloudinary is configured
    if (publicId && process.env.CLOUDINARY_API_KEY) {
      const cloudinary = await import('cloudinary');
      await cloudinary.v2.uploader.destroy(publicId);
    }

    // If local file path or URL contains /uploads/
    if (imagePathOrUrl && typeof imagePathOrUrl === 'string') {
      let relativePath = imagePathOrUrl;
      if (imagePathOrUrl.includes('/uploads/')) {
        relativePath = imagePathOrUrl.split('/uploads/')[1];
      }
      const fullPath = path.join(__dirname, '../uploads', relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`Deleted local image file: ${fullPath}`);
      }
    }
  } catch (err) {
    console.warn(`Error deleting image file (${imagePathOrUrl}):`, err.message);
  }
};
