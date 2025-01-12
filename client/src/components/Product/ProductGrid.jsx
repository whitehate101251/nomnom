import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #1a1a1a;
`;

const ProductPrice = styled.p`
  margin: 0.5rem 0;
  color: #666;
  font-weight: bold;
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const ProductGrid = ({ products }) => {
  const { addItem } = useCart();

  return (
    <Grid>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <Link to={`/product/${product.id}`}>
            <ProductImage src={product.image} alt={product.name} />
          </Link>
          <ProductInfo>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>${product.price}</ProductPrice>
            <AddToCartButton
              onClick={() => addItem(product)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Cart
            </AddToCartButton>
          </ProductInfo>
        </ProductCard>
      ))}
    </Grid>
  );
};

export default ProductGrid; 