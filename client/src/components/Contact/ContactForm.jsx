import React from 'react';
import { Formik, Form, Field } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { contactSchema } from '../../utils/validationSchemas';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ErrorMessage from '../common/ErrorMessage';
import api from '../../services/api';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
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
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#dc3545' : '#1a1a1a'};
  }
`;

const ErrorText = styled.div`
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
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactForm = () => {
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.post('/contact', values);
      resetForm();
      // Show success message
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <ErrorMessage message={error} onClose={clearError} />
      
      <Formik
        initialValues={{ name: '', email: '', message: '' }}
        validationSchema={contactSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                error={errors.name && touched.name}
              />
              <AnimatePresence>
                {errors.name && touched.name && (
                  <ErrorText
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.name}
                  </ErrorText>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                error={errors.email && touched.email}
              />
              <AnimatePresence>
                {errors.email && touched.email && (
                  <ErrorText
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.email}
                  </ErrorText>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <Input
                as="textarea"
                name="message"
                rows="5"
                error={errors.message && touched.message}
              />
              <AnimatePresence>
                {errors.message && touched.message && (
                  <ErrorText
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.message}
                  </ErrorText>
                )}
              </AnimatePresence>
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default ContactForm; 