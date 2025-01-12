import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useNetworkStatus from '../../hooks/useNetworkStatus';

const StatusBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  text-align: center;
  background: ${props => props.isOnline ? '#4CAF50' : '#dc3545'};
  color: white;
  z-index: 1000;
`;

const NetworkStatus = () => {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <StatusBar
          isOnline={isOnline}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          You are currently offline. Please check your internet connection.
        </StatusBar>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus; 