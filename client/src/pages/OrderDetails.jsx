import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import OrderTracking from '../components/Order/OrderTracking';
import CheckoutService from '../services/checkout';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Loading from '../components/common/Loading';

const OrderDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const OrderDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OrderInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const OrderSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 0.5rem 0;
`;

const ItemPrice = styled.p`
  margin: 0;
  color: #666;
`;

const AddressInfo = styled.div`
  margin-top: 0.5rem;
  line-height: 1.5;
`;

const OrderDetails = () => {
  const { orderId } = useParams();
  const { error, handleError } = useErrorHandler();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await CheckoutService.getOrderDetails(orderId);
        setOrderDetails(response);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, handleError]);

  if (loading) return <Loading />;
  if (!orderDetails) return <div>Order not found</div>;

  return (
    <OrderDetailsContainer>
      <h1>Order Details</h1>
      <OrderDetailsGrid>
        <OrderInfo>
          <OrderSection>
            <SectionTitle>Items</SectionTitle>
            <ItemList>
              {orderDetails.items.map((item) => (
                <Item key={item.id}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>
                      ${item.price} x {item.quantity}
                    </ItemPrice>
                  </ItemDetails>
                </Item>
              ))}
            </ItemList>
          </OrderSection>

          <OrderSection>
            <SectionTitle>Shipping Address</SectionTitle>
            <AddressInfo>
              {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}
              <br />
              {orderDetails.shipping.address}
              <br />
              {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zipCode}
            </AddressInfo>
          </OrderSection>

          <OrderSection>
            <SectionTitle>Order Summary</SectionTitle>
            <div>
              <p>Subtotal: ${orderDetails.subtotal.toFixed(2)}</p>
              <p>Shipping: ${orderDetails.shipping.cost.toFixed(2)}</p>
              <p>Tax: ${orderDetails.tax.toFixed(2)}</p>
              <strong>Total: ${orderDetails.total.toFixed(2)}</strong>
            </div>
          </OrderSection>
        </OrderInfo>

        <OrderTracking orderId={orderId} />
      </OrderDetailsGrid>
    </OrderDetailsContainer>
  );
};

export default OrderDetails; 