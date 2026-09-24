import api from './api';

export const uploadApi = {
  // POST /api/uploads/image - Upload single image
  async uploadImage(fileOrFormData) {
    const isFormData = fileOrFormData instanceof FormData;
    const body = isFormData ? fileOrFormData : (() => {
      const fd = new FormData();
      fd.append('image', fileOrFormData);
      return fd;
    })();

    return api.post('/uploads/image', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // POST /api/uploads/images - Upload multiple images
  async uploadImages(filesOrFormData) {
    const isFormData = filesOrFormData instanceof FormData;
    const body = isFormData ? filesOrFormData : (() => {
      const fd = new FormData();
      if (Array.isArray(filesOrFormData) || filesOrFormData instanceof FileList) {
        Array.from(filesOrFormData).forEach((file) => fd.append('images', file));
      }
      return fd;
    })();

    return api.post('/uploads/images', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // DELETE /api/uploads/image/:publicId - Delete image by publicId or filename
  async deleteImage(publicId) {
    return api.delete(`/uploads/image/${publicId}`);
  }
};

export default uploadApi;
