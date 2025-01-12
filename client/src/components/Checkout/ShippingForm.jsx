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

const shippingSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code')
    .required('ZIP code is required'),
});

const ShippingForm = ({ onSubmit }) => {
  return (
    <FormContainer>
      <h2>Shipping Information</h2>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
        }}
        validationSchema={shippingSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>First Name</Label>
                <Input name="firstName" error={errors.firstName && touched.firstName} />
                {errors.firstName && touched.firstName && (
                  <ErrorMessage>{errors.firstName}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Last Name</Label>
                <Input name="lastName" error={errors.lastName && touched.lastName} />
                {errors.lastName && touched.lastName && (
                  <ErrorMessage>{errors.lastName}</ErrorMessage>
                )}
              </FormGroup>
            </div>

            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" error={errors.email && touched.email} />
              {errors.email && touched.email && (
                <ErrorMessage>{errors.email}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input name="phone" error={errors.phone && touched.phone} />
              {errors.phone && touched.phone && (
                <ErrorMessage>{errors.phone}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Address</Label>
              <Input name="address" error={errors.address && touched.address} />
              {errors.address && touched.address && (
                <ErrorMessage>{errors.address}</ErrorMessage>
              )}
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>City</Label>
                <Input name="city" error={errors.city && touched.city} />
                {errors.city && touched.city && (
                  <ErrorMessage>{errors.city}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>State</Label>
                <Input name="state" error={errors.state && touched.state} />
                {errors.state && touched.state && (
                  <ErrorMessage>{errors.state}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>ZIP Code</Label>
                <Input name="zipCode" error={errors.zipCode && touched.zipCode} />
                {errors.zipCode && touched.zipCode && (
                  <ErrorMessage>{errors.zipCode}</ErrorMessage>
                )}
              </FormGroup>
            </div>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default ShippingForm; 