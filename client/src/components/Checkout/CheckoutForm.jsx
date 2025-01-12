import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { checkoutSchema } from '../../utils/validationSchemas';
import PaymentService from '../../services/payment';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ErrorMessage from '../common/ErrorMessage';

// ... previous styled components ...

const PaymentErrorMessage = styled(motion.div)`
  background: #fff3f3;
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #dc3545;
`;

const CheckoutForm = ({ cart, onSuccess }) => {
  const [paymentError, setPaymentError] = useState(null);
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setPaymentError(null);
      
      // First validate the card
      const isCardValid = await PaymentService.validateCard({
        number: values.cardNumber,
        expiry: values.cardExpiry,
        cvc: values.cardCvc
      });

      if (!isCardValid) {
        setPaymentError('Invalid card details');
        return;
      }

      // Process payment
      await PaymentService.processPayment({
        amount: cart.total,
        currency: 'USD',
        cardDetails: {
          number: values.cardNumber,
          expiry: values.cardExpiry,
          cvc: values.cardCvc
        },
        billingDetails: {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          address: values.address,
          city: values.city,
          zipCode: values.zipCode
        }
      });

      onSuccess();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <ErrorMessage message={error} onClose={clearError} />
      
      <AnimatePresence>
        {paymentError && (
          <PaymentErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {paymentError}
          </PaymentErrorMessage>
        )}
      </AnimatePresence>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          city: '',
          zipCode: '',
          cardNumber: '',
          cardExpiry: '',
          cardCvc: ''
        }}
        validationSchema={checkoutSchema}
        onSubmit={handleSubmit}
      >
        {/* Form fields implementation */}
      </Formik>
    </FormContainer>
  );
};

export default CheckoutForm; 