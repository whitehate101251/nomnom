import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutService from '../services/checkout';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ShippingForm from '../components/Checkout/ShippingForm';
import PaymentForm from '../components/Checkout/PaymentForm';
import OrderSummary from '../components/Checkout/OrderSummary';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StepIndicator = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #eee;
    z-index: -1;
  }
`;

const Step = styled.div`
  background: ${props => props.active ? '#1a1a1a' : '#eee'};
  color: ${props => props.active ? 'white' : '#666'};
  padding: 1rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { error, handleError } = useErrorHandler();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  const handleShippingSubmit = async (data) => {
    try {
      await CheckoutService.validateShipping(data);
      const shippingRate = await CheckoutService.calculateShipping(data, items);
      setShippingData(data);
      setShippingCost(shippingRate.cost);
      setCurrentStep(2);
    } catch (err) {
      handleError(err);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const order = await CheckoutService.createOrder({
        items,
        shipping: shippingData,
        payment: paymentData,
        total: cartTotal + shippingCost
      });

      await CheckoutService.processPayment({
        orderId: order.id,
        amount: order.total,
        ...paymentData
      });

      clearCart();
      navigate('/order-confirmation', { state: { orderId: order.id } });
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <CheckoutContainer>
      <StepIndicator>
        <Step active={currentStep === 1}>1</Step>
        <Step active={currentStep === 2}>2</Step>
      </StepIndicator>

      <CheckoutGrid>
        <div>
          {currentStep === 1 && (
            <ShippingForm onSubmit={handleShippingSubmit} />
          )}
          {currentStep === 2 && (
            <PaymentForm onSubmit={handlePaymentSubmit} />
          )}
        </div>

        <OrderSummary
          items={items}
          subtotal={cartTotal}
          shipping={shippingCost}
          total={cartTotal + shippingCost}
        />
      </CheckoutGrid>
    </CheckoutContainer>
  );
};

export default Checkout; 