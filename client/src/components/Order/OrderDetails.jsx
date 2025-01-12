import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import UserService from '../../services/user';
import Loading from '../common/Loading';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled(Link)`
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #333;
  }
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

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ItemCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ItemDetails = styled.div`
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const AddressBox = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const OrderSummary = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .total {
    font-weight: bold;
    border-top: 1px solid #ddd;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const data = await UserService.getOrderDetails(id);
        setOrder(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, handleError]);

  if (loading) return <Loading />;
  if (!order) return <div>Order not found</div>;

  return (
    <Container>
      <Header>
        <BackButton to="/profile/orders">
          ← Back to Orders
        </BackButton>
        <OrderStatus status={order.status}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </OrderStatus>
      </Header>

      <Section>
        <SectionTitle>Order #{order.id}</SectionTitle>
        <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </Section>

      <Section>
        <SectionTitle>Items</SectionTitle>
        <ItemsGrid>
          {order.items.map((item) => (
            <ItemCard key={item.id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemDetails>
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>${item.price.toFixed(2)} each</p>
              </ItemDetails>
            </ItemCard>
          ))}
        </ItemsGrid>
      </Section>

      <Section>
        <SectionTitle>Shipping Address</SectionTitle>
        <AddressBox>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </AddressBox>
      </Section>

      <Section>
        <SectionTitle>Order Summary</SectionTitle>
        <OrderSummary>
          <div>
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping:</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax:</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="total">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </OrderSummary>
      </Section>
    </Container>
  );
};

export default OrderDetails; 