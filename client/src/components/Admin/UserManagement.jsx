import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import AdminService from '../../services/admin';
import Loading from '../common/Loading';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #1a1a1a;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
  }
`;

const RoleBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.role === 'admin' ? '#cfe2ff' : '#d1e7dd'};
  color: ${props => props.role === 'admin' ? '#084298' : '#0f5132'};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.active ? '#d1e7dd' : '#f8d7da'};
  color: ${props => props.active ? '#0f5132' : '#842029'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const UserDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const DetailSection = styled.div`
  h4 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

const ActivityList = styled.div`
  margin-top: 1rem;
`;

const ActivityItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  h5 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.875rem;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.delete ? '#dc3545' : '#0d6efd'};
  cursor: pointer;
  padding: 0.5rem;
  margin-right: ${props => props.delete ? '0' : '1rem'};

  &:hover {
    text-decoration: underline;
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await AdminService.updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await AdminService.deleteUser(userId);
        await loadUsers();
        setSelectedUser(null);
      } catch (err) {
        handleError(err);
      }
    }
  };

  const filteredUsers = users
    .filter(user => roleFilter === 'all' || user.role === roleFilter)
    .filter(user => 
      searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) return <Loading />;

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
      </Header>

      <FilterSection>
        <SearchInput
          type="text"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </Select>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <RoleBadge role={user.role}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </RoleBadge>
              </td>
              <td>
                <StatusBadge active={user.active}>
                  {user.active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <ActionButton onClick={() => setSelectedUser(user)}>
                  View Details
                </ActionButton>
                <ActionButton delete onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedUser && (
        <Modal>
          <ModalContent>
            <Header>
              <h3>User Details</h3>
              <ActionButton onClick={() => setSelectedUser(null)}>Close</ActionButton>
            </Header>

            <UserDetails>
              <DetailSection>
                <h4>Basic Information</h4>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </DetailSection>

              <DetailSection>
                <h4>Role Management</h4>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </Select>
              </DetailSection>

              <DetailSection>
                <h4>Account Statistics</h4>
                <p><strong>Total Orders:</strong> {selectedUser.stats?.totalOrders || 0}</p>
                <p><strong>Total Spent:</strong> ${selectedUser.stats?.totalSpent?.toFixed(2) || '0.00'}</p>
                <p><strong>Last Order:</strong> {selectedUser.stats?.lastOrderDate ? new Date(selectedUser.stats.lastOrderDate).toLocaleDateString() : 'Never'}</p>
              </DetailSection>
            </UserDetails>

            <DetailSection>
              <h4>Recent Activity</h4>
              <ActivityList>
                {selectedUser.activity?.map((activity, index) => (
                  <ActivityItem key={index}>
                    <h5>{activity.type}</h5>
                    <p>{activity.description}</p>
                    <p>{new Date(activity.date).toLocaleString()}</p>
                  </ActivityItem>
                ))}
              </ActivityList>
            </DetailSection>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UserManagement; 