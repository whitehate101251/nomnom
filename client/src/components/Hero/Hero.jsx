import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0 2rem;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
`;

const HeroButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease;
`;

const Hero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          A perfume is something which is invisible and yet an unforgettable accessory
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover our collection of luxury fragrances
        </HeroSubtitle>
        <HeroButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Shop Now
        </HeroButton>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero; 