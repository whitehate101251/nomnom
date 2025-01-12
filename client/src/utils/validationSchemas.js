import * as Yup from 'yup';

export const newsletterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  message: Yup.string()
    .min(10, 'Message is too short')
    .max(1000, 'Message is too long')
    .required('Message is required'),
});

export const checkoutSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string().required('ZIP code is required'),
}); 