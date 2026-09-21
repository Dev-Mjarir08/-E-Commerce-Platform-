import { removeImageFile } from '../middlewares/upload.middleware.js';

/**
 * @desc    Upload a single image
 * @route   POST /api/uploads/image
 * @access  Private (Vendor / Seller / Admin)
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      if (req.body.url) {
        return res.status(200).json({
          success: true,
          message: 'Image registered successfully.',
          data: {
            url: req.body.url,
            public_id: req.body.public_id || null
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file using multipart field "image" or provide "url" in JSON.'
      });
    }

    const fileUrl = `/uploads/products/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: fileUrl,
        public_id: req.file.filename,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('uploadImage error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload image.', error: error.message });
  }
};

/**
 * @desc    Upload multiple images
 * @route   POST /api/uploads/images
 * @access  Private (Vendor / Seller / Admin)
 */
export const uploadImages = async (req, res) => {
  try {
    const files = req.files || [];

    if (files.length === 0) {
      if (Array.isArray(req.body.urls) && req.body.urls.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Images registered successfully.',
          count: req.body.urls.length,
          data: req.body.urls.map((url, idx) => ({
            url,
            public_id: req.body.public_ids?.[idx] || null
          }))
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Please upload image files using multipart field "images" or provide "urls" array.'
      });
    }

    const uploaded = files.map((file) => ({
      url: `/uploads/products/${file.filename}`,
      public_id: file.filename,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    return res.status(201).json({
      success: true,
      message: `Uploaded ${uploaded.length} images successfully.`,
      count: uploaded.length,
      data: uploaded
    });
  } catch (error) {
    console.error('uploadImages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload images.', error: error.message });
  }
};

/**
 * @desc    Delete uploaded image
 * @route   DELETE /api/uploads/image/:publicId
 * @access  Private (Vendor / Seller / Admin)
 */
export const deleteUploadedImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId or filename parameter is required.' });
    }

    // Check if it corresponds to local path
    const localPath = `/uploads/products/${publicId}`;
    await removeImageFile(localPath, publicId);

    return res.status(200).json({
      success: true,
      message: `Image '${publicId}' deleted successfully.`
    });
  } catch (error) {
    console.error('deleteUploadedImage error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete image.', error: error.message });
  }
};
