import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

const CardIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const paymentSchema = Yup.object().shape({
  cardName: Yup.string().required('Cardholder name is required'),
  cardNumber: Yup.string()
    .matches(/^[0-9]{16}$/, 'Invalid card number')
    .required('Card number is required'),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)')
    .required('Expiry date is required'),
  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, 'Invalid CVV')
    .required('CVV is required'),
  billingAddress: Yup.string().required('Billing address is required'),
});

const PaymentForm = ({ onSubmit }) => {
  const formatCardNumber = (value) => {
    if (!value) return value;
    const cardNumber = value.replace(/\s/g, '');
    const parts = cardNumber.match(/.{1,4}/g);
    return parts ? parts.join(' ') : cardNumber;
  };

  const formatExpiryDate = (value) => {
    if (!value) return value;
    const expiry = value.replace(/\D/g, '');
    if (expiry.length >= 2) {
      return `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}`;
    }
    return expiry;
  };

  return (
    <FormContainer>
      <h2>Payment Information</h2>
      <Formik
        initialValues={{
          cardName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          billingAddress: ''
        }}
        validationSchema={paymentSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label>Cardholder Name</Label>
              <Input 
                name="cardName" 
                error={errors.cardName && touched.cardName}
                placeholder="John Doe"
              />
              {errors.cardName && touched.cardName && (
                <ErrorMessage>{errors.cardName}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Card Number</Label>
              <InputWrapper>
                <Input
                  name="cardNumber"
                  error={errors.cardNumber && touched.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  onChange={(e) => {
                    setFieldValue('cardNumber', formatCardNumber(e.target.value));
                  }}
                />
                <CardIcon>💳</CardIcon>
              </InputWrapper>
              {errors.cardNumber && touched.cardNumber && (
                <ErrorMessage>{errors.cardNumber}</ErrorMessage>
              )}
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>Expiry Date</Label>
                <Input
                  name="expiryDate"
                  error={errors.expiryDate && touched.expiryDate}
                  placeholder="MM/YY"
                  onChange={(e) => {
                    setFieldValue('expiryDate', formatExpiryDate(e.target.value));
                  }}
                />
                {errors.expiryDate && touched.expiryDate && (
                  <ErrorMessage>{errors.expiryDate}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>CVV</Label>
                <Input
                  name="cvv"
                  type="password"
                  error={errors.cvv && touched.cvv}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && touched.cvv && (
                  <ErrorMessage>{errors.cvv}</ErrorMessage>
                )}
              </FormGroup>
            </div>

            <FormGroup>
              <Label>Billing Address</Label>
              <Input
                name="billingAddress"
                as="textarea"
                rows="3"
                error={errors.billingAddress && touched.billingAddress}
              />
              {errors.billingAddress && touched.billingAddress && (
                <ErrorMessage>{errors.billingAddress}</ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Processing Payment...' : 'Complete Purchase'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default PaymentForm; 