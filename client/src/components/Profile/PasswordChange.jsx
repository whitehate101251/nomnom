import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import UserService from '../../services/user';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 0 auto;
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

const SuccessMessage = styled(motion.div)`
  padding: 1rem;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const PasswordChange = () => {
  const { handleError } = useErrorHandler();
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setShowSuccess(true);
      resetForm();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      {showSuccess && (
        <SuccessMessage
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Password updated successfully!
        </SuccessMessage>
      )}

      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={passwordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                error={errors.currentPassword && touched.currentPassword}
              />
              {errors.currentPassword && touched.currentPassword && (
                <ErrorMessage>{errors.currentPassword}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                error={errors.newPassword && touched.newPassword}
              />
              {errors.newPassword && touched.newPassword && (
                <ErrorMessage>{errors.newPassword}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                error={errors.confirmPassword && touched.confirmPassword}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default PasswordChange; 