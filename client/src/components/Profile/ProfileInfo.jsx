import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import UserService from '../../services/user';

const ProfileContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
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

const SaveButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number'),
  address: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  zipCode: Yup.string().matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code'),
});

const ProfileInfo = ({ profile, onUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await UserService.uploadProfilePicture(file);
      onUpdate({ ...profile, avatar: response.avatarUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProfileContainer>
      <AvatarSection>
        <Avatar>
          <img src={profile.avatar || '/default-avatar.png'} alt="Profile" />
        </Avatar>
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
          <UploadButton
            as={motion.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Change Photo'}
          </UploadButton>
        </label>
      </AvatarSection>

      <Formik
        initialValues={{
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          zipCode: profile.zipCode || '',
        }}
        validationSchema={profileSchema}
        onSubmit={onUpdate}
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

            <SaveButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </Form>
        )}
      </Formik>
    </ProfileContainer>
  );
};

export default ProfileInfo; 