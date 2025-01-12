import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RelatedSection = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const ProductPrice = styled.p`
  color: #666;
`;

const ViewButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
`;

const RelatedProducts = ({ products, onProductSelect }) => {
  return (
    <RelatedSection>
      <SectionTitle>You May Also Like</SectionTitle>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price}</ProductPrice>
                <ViewButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onProductSelect(product)}
                >
                  View Product
                </ViewButton>
              </ProductInfo>
            </ProductCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </RelatedSection>
  );
};

export default RelatedProducts; 