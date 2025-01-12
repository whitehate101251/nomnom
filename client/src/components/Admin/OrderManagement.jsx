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

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
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

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'processing': return '#cfe2ff';
      case 'shipped': return '#d1e7dd';
      case 'delivered': return '#198754';
      case 'cancelled': return '#f8d7da';
      default: return '#eee';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'processing': return '#084298';
      case 'shipped': return '#0f5132';
      case 'delivered': return '#fff';
      case 'cancelled': return '#842029';
      default: return '#666';
    }
  }};
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

const OrderDetails = styled.div`
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

const ItemsList = styled.div`
  margin-top: 1rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #0d6efd;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await AdminService.getOrders();
      setOrders(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await AdminService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      handleError(err);
    }
  };

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) return <Loading />;

  return (
    <Container>
      <Header>
        <Title>Order Management</Title>
      </Header>

      <FilterSection>
        <SearchInput
          type="text"
          placeholder="Search by Order ID or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <StatusBadge status={order.status}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </StatusBadge>
              </td>
              <td>
                <ActionButton onClick={() => setSelectedOrder(order)}>
                  View Details
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <Modal>
          <ModalContent>
            <Header>
              <h3>Order Details - #{selectedOrder.id}</h3>
              <ActionButton onClick={() => setSelectedOrder(null)}>Close</ActionButton>
            </Header>

            <OrderDetails>
              <DetailSection>
                <h4>Customer Information</h4>
                <p>{selectedOrder.customer.name}</p>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.phone}</p>
              </DetailSection>

              <DetailSection>
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </DetailSection>

              <DetailSection>
                <h4>Order Status</h4>
                <Select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </DetailSection>

              <DetailSection>
                <h4>Order Summary</h4>
                <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
                <p>Shipping: ${selectedOrder.shipping.toFixed(2)}</p>
                <p>Tax: ${selectedOrder.tax.toFixed(2)}</p>
                <p><strong>Total: ${selectedOrder.total.toFixed(2)}</strong></p>
              </DetailSection>
            </OrderDetails>

            <DetailSection>
              <h4>Order Items</h4>
              <ItemsList>
                {selectedOrder.items.map(item => (
                  <Item key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h5>{item.name}</h5>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </Item>
                ))}
              </ItemsList>
            </DetailSection>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default OrderManagement; 