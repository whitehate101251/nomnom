import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import UploadService from '../../services/upload';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const UploadContainer = styled.div`
  margin: 2rem 0;
`;

const DropzoneArea = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? '#f0f9f0' : 'white'};
`;

const ProgressBar = styled(motion.div)`
  height: 4px;
  background: #4CAF50;
  margin-top: 1rem;
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileUpload = ({ onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const { error, handleError, clearError } = useErrorHandler();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      await UploadService.validateFile(file);
      setCurrentFile(file);
      
      const result = await UploadService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      onUploadComplete?.(result);
      setUploadProgress(0);
      setCurrentFile(null);
    } catch (err) {
      handleError(err);
    }
  }, [handleError, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  return (
    <UploadContainer>
      <ErrorMessage message={error} onClose={clearError} />
      
      <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </DropzoneArea>

      <AnimatePresence>
        {uploadProgress > 0 && (
          <ProgressBar
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            exit={{ width: 0 }}
          />
        )}
      </AnimatePresence>

      {currentFile && (
        <FilePreview>
          <span>{currentFile.name}</span>
          <span>{Math.round(currentFile.size / 1024)} KB</span>
        </FilePreview>
      )}
    </UploadContainer>
  );
};

export default FileUpload; 