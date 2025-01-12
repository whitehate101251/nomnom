import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorContainer = styled(motion.div)`
  background: #fff3f3;
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorText = styled.p`
  color: #dc3545;
  margin: 0;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ErrorMessage = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <ErrorContainer
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorText>{message}</ErrorText>
          {onClose && (
            <CloseButton onClick={onClose} aria-label="Close error message">
              ×
            </CloseButton>
          )}
        </ErrorContainer>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage; 