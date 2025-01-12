import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
`;

const CartItem = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemName = styled.h4`
  margin: 0;
  font-size: 1rem;
`;

const ItemPrice = styled.p`
  margin: 0;
  color: #666;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #f1f1f1;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e1e1e1;
  }
`;

const CartFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem 0;
  margin-top: 2rem;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
`;

const Cart = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <CartOverlay
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <CartHeader>
              <h2>Your Cart ({items.length})</h2>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </CartHeader>

            {items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ItemImage src={item.image} alt={item.name} />
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemPrice>${item.price}</ItemPrice>
                      <QuantityControl>
                        <QuantityButton
                          onClick={() =>
                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                          }
                        >
                          -
                        </QuantityButton>
                        <span>{item.quantity}</span>
                        <QuantityButton
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </QuantityButton>
                      </QuantityControl>
                    </ItemInfo>
                    <CloseButton onClick={() => removeItem(item.id)}>
                      &times;
                    </CloseButton>
                  </CartItem>
                ))}

                <CartFooter>
                  <CartTotal>
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </CartTotal>
                  <CheckoutButton
                    as={Link}
                    to="/checkout"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                  >
                    Proceed to Checkout
                  </CheckoutButton>
                </CartFooter>
              </>
            )}
          </CartOverlay>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart; 