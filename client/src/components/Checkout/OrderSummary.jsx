import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SummaryContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ItemList = styled.div`
  margin-bottom: 2rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-weight: 500;
  margin: 0;
`;

const ItemQuantity = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ItemPrice = styled.span`
  font-weight: 500;
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: ${props => props.total ? '#1a1a1a' : '#666'};
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  font-size: ${props => props.total ? '1.2rem' : '1rem'};
`;

const PromoCode = styled.div`
  margin: 1.5rem 0;
`;

const PromoInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ApplyButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const OrderSummary = ({ items, subtotal, shipping, total }) => {
  return (
    <SummaryContainer>
      <SummaryTitle>Order Summary</SummaryTitle>
      
      <ItemList>
        {items.map((item) => (
          <Item key={item.id}>
            <ItemInfo>
              <ItemImage src={item.image} alt={item.name} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
              </ItemDetails>
            </ItemInfo>
            <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
          </Item>
        ))}
      </ItemList>

      <PromoCode>
        <PromoInput placeholder="Enter promo code" />
        <ApplyButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply
        </ApplyButton>
      </PromoCode>

      <SummarySection>
        <SummaryRow>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Tax</span>
          <span>${(subtotal * 0.1).toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow total>
          <span>Total</span>
          <span>${(total + (subtotal * 0.1)).toFixed(2)}</span>
        </SummaryRow>
      </SummarySection>
    </SummaryContainer>
  );
};

export default OrderSummary; 