import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

const ProductsSection = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`;

const ProductCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const BuyButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Midnight Rose",
      price: "$129.99",
      image: "/images/perfume1.jpg",
      description: "A mysterious blend of rose and dark woods"
    },
    {
      id: 2,
      name: "Ocean Breeze",
      price: "$99.99",
      image: "/images/perfume2.jpg",
      description: "Fresh aquatic notes with a hint of citrus"
    },
    {
      id: 3,
      name: "Golden Amber",
      price: "$149.99",
      image: "/images/perfume3.jpg",
      description: "Warm amber with vanilla undertones"
    },
    // Add more products as needed
  ];

  return (
    <ProductsSection>
      <ProductsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Signature Collection
        </SectionTitle>
        
        <ProductGrid>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
                <BuyButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </BuyButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </ProductsContainer>
    </ProductsSection>
  );
};

export default Products; 