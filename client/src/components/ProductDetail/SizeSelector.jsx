import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SizeContainer = styled.div`
  margin: 2rem 0;
`;

const SizeTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SizeOption = styled(motion.button)`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#1a1a1a' : '#ddd'};
  border-radius: 8px;
  background: ${props => props.selected ? '#1a1a1a' : 'white'};
  color: ${props => props.selected ? 'white' : '#1a1a1a'};
  cursor: pointer;
  font-size: 0.9rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SizeInfo = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const StockIndicator = styled.span`
  font-size: 0.8rem;
  color: ${props => props.inStock ? '#4CAF50' : '#f44336'};
  display: block;
  margin-top: 0.5rem;
`;

const PriceTag = styled.span`
  font-weight: bold;
  color: #1a1a1a;
  display: block;
  margin-top: 0.5rem;
`;

const SizeSelector = ({ sizes, selectedSize, onSelect }) => {
  const [hoveredSize, setHoveredSize] = useState(null);

  return (
    <SizeContainer>
      <SizeTitle>Select Size</SizeTitle>
      <SizeGrid>
        {sizes.map(size => (
          <SizeOption
            key={size.value}
            selected={selectedSize === size.value}
            onClick={() => onSelect(size.value)}
            disabled={!size.inStock}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredSize(size.value)}
            onHoverEnd={() => setHoveredSize(null)}
          >
            {size.label}
            <br />
            {size.volume}ml
            <PriceTag>${size.price}</PriceTag>
            <StockIndicator inStock={size.inStock}>
              {size.inStock ? 
                `${size.stockCount} in stock` : 
                'Out of stock'
              }
            </StockIndicator>
            {hoveredSize === size.value && size.discount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#4CAF50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                Save {size.discount}%
              </motion.div>
            )}
          </SizeOption>
        ))}
      </SizeGrid>
      <SizeInfo>
        {selectedSize ? (
          <>
            Selected: {selectedSize}ml
            {sizes.find(s => s.value === selectedSize)?.description}
          </>
        ) : (
          'Please select a size'
        )}
      </SizeInfo>
    </SizeContainer>
  );
};

export default SizeSelector; 