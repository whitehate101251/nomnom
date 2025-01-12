import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FooterSection = styled.footer`
  background: #1a1a1a;
  color: #fff;
  padding: 4rem 2rem 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const FooterLink = styled(Link)`
  color: #999;
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled(motion.a)`
  color: #fff;
  font-size: 1.5rem;
  
  &:hover {
    color: #999;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
  color: #999;
`;

const Footer = () => {
  return (
    <FooterSection>
      <FooterContainer>
        <FooterColumn>
          <FooterTitle>LaScentlo</FooterTitle>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            Discover the art of luxury fragrances crafted with passion and precision.
          </p>
          <SocialLinks>
            <SocialIcon 
              href="https://instagram.com"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fab fa-instagram"></i>
            </SocialIcon>
            <SocialIcon 
              href="https://facebook.com"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fab fa-facebook"></i>
            </SocialIcon>
            <SocialIcon 
              href="https://twitter.com"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fab fa-twitter"></i>
            </SocialIcon>
          </SocialLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/products">Products</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/blogs">Blogs</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Customer Service</FooterTitle>
          <FooterLink to="/shipping">Shipping Info</FooterLink>
          <FooterLink to="/returns">Returns</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Newsletter</FooterTitle>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email"
              style={{
                padding: '0.8rem',
                width: '100%',
                marginBottom: '1rem',
                border: 'none',
                borderRadius: '5px'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.8rem 1.5rem',
                background: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Subscribe
            </motion.button>
          </form>
        </FooterColumn>
      </FooterContainer>

      <Copyright>
        © {new Date().getFullYear()} LaScentlo. All rights reserved.
      </Copyright>
    </FooterSection>
  );
};

export default Footer; 