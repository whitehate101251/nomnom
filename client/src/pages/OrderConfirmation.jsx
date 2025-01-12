import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import OrderUpdatesService from '../services/orderUpdates';

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessIcon = styled(motion.div)`
  color: #4CAF50;
  font-size: 4rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const OrderNumber = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  span {
    font-weight: bold;
    color: #1a1a1a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  ${props => props.primary ? `
    background: #1a1a1a;
    color: white;
  ` : `
    background: #f8f9fa;
    color: #1a1a1a;
  `}
`;

const OrderStatus = styled(motion.div)`
  margin: 2rem 0;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  color: #2e7d32;
`;

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [orderStatus, setOrderStatus] = useState('Processing');

  useEffect(() => {
    if (orderId) {
      OrderUpdatesService.subscribeToOrderUpdates(orderId, (update) => {
        setOrderStatus(update.status);
      });
    }
    
    return () => {
      if (orderId) {
        OrderUpdatesService.unsubscribeFromOrderUpdates(orderId);
      }
    };
  }, [orderId]);

  return (
    <ConfirmationContainer>
      <SuccessIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <FaCheckCircle />
      </SuccessIcon>
      
      <Title>Thank You for Your Order!</Title>
      <Message>
        We've received your order and will notify you once it ships.
      </Message>
      
      <OrderNumber>
        Order Number: <span>#{orderId}</span>
      </OrderNumber>
      
      <OrderStatus
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Order Status: {orderStatus}
      </OrderStatus>
      
      <ButtonGroup>
        <Button
          as={Link}
          to="/orders"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          primary
        >
          View Order
        </Button>
        <Button
          as={Link}
          to="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Shopping
        </Button>
      </ButtonGroup>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation; 