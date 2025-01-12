import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SizeSelector from './SizeSelector';
import SocialShare from './SocialShare';
import ProductComparison from './ProductComparison';
import RelatedProducts from './RelatedProducts';
import ProductReviews from '../Reviews/ProductReviews';

const ProductSection = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 100px;
`;

const MainImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const Thumbnail = styled(motion.img)`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

const ProductInfo = styled.div`
  padding: 2rem 0;
`;

const ProductTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const ProductDetails = styled.div`
  margin-top: 3rem;
`;

const DetailTab = styled(motion.button)`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#1a1a1a' : 'transparent'};
  color: ${props => props.active ? '#1a1a1a' : '#666'};
  cursor: pointer;
  margin-right: 2rem;
`;

const DetailContent = styled(motion.div)`
  padding: 2rem 0;
  color: #666;
  line-height: 1.6;
`;

const WishlistButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1rem;
`;

const TabContainer = styled.div`
  margin-top: 4rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TabButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${props => props.active ? '#1a1a1a' : 'transparent'};
  color: ${props => props.active ? 'white' : '#1a1a1a'};
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
`;

const ProductDetail = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [comparisonProduct, setComparisonProduct] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();
  const currentUrl = window.location.href;

  const sizes = [
    { value: '30', label: 'Small', volume: 30, price: 49.99, inStock: true, stockCount: 15 },
    { value: '50', label: 'Medium', volume: 50, price: 79.99, inStock: true, stockCount: 10, discount: 10 },
    { value: '100', label: 'Large', volume: 100, price: 129.99, inStock: false }
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    const selectedSizeDetails = sizes.find(size => size.value === selectedSize);
    addToCart({
      ...product,
      size: selectedSize,
      price: selectedSizeDetails.price
    });
  };

  return (
    <ProductSection>
      <ProductContainer>
        <ImageSection>
          <MainImage
            src={product.images[selectedImage]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <ThumbnailGrid>
            {product.images.map((image, index) => (
              <Thumbnail
                key={index}
                src={image}
                onClick={() => setSelectedImage(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </ThumbnailGrid>
        </ImageSection>

        <ProductInfo>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>Starting from ${sizes[0].price}</ProductPrice>
            <ProductDescription>{product.description}</ProductDescription>
            
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <AddToCartButton
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Cart
              </AddToCartButton>
              <WishlistButton
                onClick={() => addToWishlist(product)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="far fa-heart"></i>
              </WishlistButton>
            </div>

            <SocialShare product={product} currentUrl={currentUrl} />
          </motion.div>

          <TabContainer>
            <TabButtons>
              <TabButton
                active={activeTab === 'description'}
                onClick={() => setActiveTab('description')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Description
              </TabButton>
              <TabButton
                active={activeTab === 'ingredients'}
                onClick={() => setActiveTab('ingredients')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ingredients
              </TabButton>
              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reviews
              </TabButton>
            </TabButtons>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {activeTab === 'description' && (
                  <div>{product.longDescription}</div>
                )}
                {activeTab === 'ingredients' && (
                  <div>{product.ingredients}</div>
                )}
                {activeTab === 'reviews' && (
                  <ProductReviews productId={product.id} />
                )}
              </motion.div>
            </AnimatePresence>
          </TabContainer>
        </ProductInfo>
      </ProductContainer>

      {comparisonProduct && (
        <ProductComparison
          product1={product}
          product2={comparisonProduct}
        />
      )}

      <RelatedProducts
        products={product.relatedProducts}
        onProductSelect={(selectedProduct) => setComparisonProduct(selectedProduct)}
      />
    </ProductSection>
  );
};

export default ProductDetail; 