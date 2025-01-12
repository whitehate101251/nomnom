import api from './api';
import { handleApiError } from './api';

class UploadService {
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        },
      });
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error);
      
      // Handle specific upload errors
      if (error.response?.data?.code) {
        switch (error.response.data.code) {
          case 'file_too_large':
            throw new Error('File size exceeds the limit (max 5MB)');
          case 'invalid_file_type':
            throw new Error('Invalid file type. Supported types: JPG, PNG, PDF');
          case 'upload_failed':
            throw new Error('Upload failed. Please try again');
          default:
            throw new Error(errorData.message);
        }
      }
      
      throw new Error(errorData.message);
    }
  }

  async validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds the limit (max 5MB)');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Supported types: JPG, PNG, PDF');
    }

    return true;
  }
}

export default new UploadService(); 