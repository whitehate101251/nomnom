import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1a1a1a;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Loading = ({ fullScreen }) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner />
    </LoadingContainer>
  );
};

export default Loading; 