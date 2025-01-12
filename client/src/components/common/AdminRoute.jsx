import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // Check if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 