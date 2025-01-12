import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f8f9fa;
`;

const ErrorContent = styled(motion.div)`
  text-align: center;
  max-width: 600px;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: #dc3545;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const RetryButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              {this.props.fallback || "We're having trouble displaying this content"}
            </ErrorMessage>
            <RetryButton
              onClick={this.handleRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </RetryButton>
            {process.env.NODE_ENV === 'development' && (
              <pre style={{ 
                marginTop: '2rem', 
                textAlign: 'left', 
                background: '#f1f1f1', 
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            )}
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 