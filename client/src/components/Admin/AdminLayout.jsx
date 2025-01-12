import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1a1a1a;
  color: white;
  padding: 2rem;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AdminLayout = () => {
  return (
    <Container>
      <Sidebar>
        <Logo>Admin Panel</Logo>
        <nav>
          <NavItem to="/admin/dashboard">Dashboard</NavItem>
          <NavItem to="/admin/products">Products</NavItem>
          <NavItem to="/admin/orders">Orders</NavItem>
          <NavItem to="/admin/users">Users</NavItem>
          <NavItem to="/admin/analytics">Analytics</NavItem>
        </nav>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default AdminLayout; 