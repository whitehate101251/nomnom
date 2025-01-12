import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import UserService from '../../services/user';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import Loading from '../common/Loading';

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const OrderCard = styled(motion.div)`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OrderNumber = styled.h3`
  margin: 0;
  color: #1a1a1a;
`;

const OrderDate = styled.span`
  color: #666;
`;

const OrderStatus = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: ${props => {
    switch (props.status) {
      case 'processing': return '#fff3cd';
      case 'shipped': return '#cfe2ff';
      case 'delivered': return '#d1e7dd';
      case 'cancelled': return '#f8d7da';
      default: return '#eee';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'processing': return '#856404';
      case 'shipped': return '#084298';
      case 'delivered': return '#0f5132';
      case 'cancelled': return '#842029';
      default: return '#666';
    }
  }};
`;

const OrderItems = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const ItemCard = styled.div`
  flex: 0 0 auto;
  width: 80px;
  text-align: center;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ItemQuantity = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderTotal = styled.div`
  font-weight: bold;
  color: #1a1a1a;
`;

const ViewDetailsButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background: #333;
  }
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await UserService.getOrderHistory();
        setOrders(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [handleError]);

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <Container>
        <NoOrders>
          <h3>No Orders Yet</h3>
          <p>When you place orders, they will appear here.</p>
        </NoOrders>
      </Container>
    );
  }

  return (
    <Container>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <OrderHeader>
            <div>
              <OrderNumber>Order #{order.id}</OrderNumber>
              <OrderDate>{new Date(order.createdAt).toLocaleDateString()}</OrderDate>
            </div>
            <OrderStatus status={order.status}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </OrderStatus>
          </OrderHeader>

          <OrderItems>
            {order.items.map((item) => (
              <ItemCard key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemQuantity>x{item.quantity}</ItemQuantity>
              </ItemCard>
            ))}
          </OrderItems>

          <OrderFooter>
            <OrderTotal>Total: ${order.total.toFixed(2)}</OrderTotal>
            <ViewDetailsButton to={`/order/${order.id}`}>
              View Details
            </ViewDetailsButton>
          </OrderFooter>
        </OrderCard>
      ))}
    </Container>
  );
};

export default OrderHistory; 