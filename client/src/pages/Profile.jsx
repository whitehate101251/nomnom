import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import UserService from '../services/user';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Loading from '../components/common/Loading';
import ProfileInfo from '../components/Profile/ProfileInfo';
import PasswordChange from '../components/Profile/PasswordChange';
import OrderHistory from '../components/Profile/OrderHistory';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await UserService.getUserProfile();
        setProfile(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [handleError]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const data = await UserService.updateProfile(updatedData);
      setProfile(data);
    } catch (err) {
      handleError(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      
      <TabContainer>
        <Tab
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Profile Info
        </Tab>
        <Tab
          active={activeTab === 'password'}
          onClick={() => setActiveTab('password')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Change Password
        </Tab>
        <Tab
          active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Order History
        </Tab>
      </TabContainer>

      {activeTab === 'profile' && (
        <ProfileInfo
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
      )}
      
      {activeTab === 'password' && (
        <PasswordChange />
      )}
      
      {activeTab === 'orders' && (
        <OrderHistory />
      )}
    </ProfileContainer>
  );
};

export default Profile; 