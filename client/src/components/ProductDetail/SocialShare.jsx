import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsappIcon
} from 'react-share';

const ShareContainer = styled.div`
  margin: 2rem 0;
`;

const ShareTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconWrapper = styled(motion.div)`
  cursor: pointer;
`;

const ShareAnalytics = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ShareCount = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.5rem;
`;

const CopyLinkButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const SocialShare = ({ product, currentUrl }) => {
  const [shareCount, setShareCount] = useState({
    facebook: 0,
    twitter: 0,
    pinterest: 0,
    whatsapp: 0
  });
  const [copied, setCopied] = useState(false);

  const handleShare = (platform) => {
    setShareCount(prev => ({
      ...prev,
      [platform]: prev[platform] + 1
    }));
    // Here you could also send analytics data to your backend
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareTitle = `Check out ${product.name} on LaScentlo`;
  
  return (
    <ShareContainer>
      <ShareTitle>Share This Product</ShareTitle>
      <ShareButtons>
        <IconWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FacebookShareButton url={currentUrl} quote={shareTitle} onClick={() => handleShare('facebook')}>
            <FacebookIcon size={32} round />
            <ShareCount>{shareCount.facebook}</ShareCount>
          </FacebookShareButton>
        </IconWrapper>

        <IconWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <TwitterShareButton url={currentUrl} title={shareTitle} onClick={() => handleShare('twitter')}>
            <TwitterIcon size={32} round />
            <ShareCount>{shareCount.twitter}</ShareCount>
          </TwitterShareButton>
        </IconWrapper>

        <IconWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <PinterestShareButton
            url={currentUrl}
            media={product.image}
            description={shareTitle}
            onClick={() => handleShare('pinterest')}
          >
            <PinterestIcon size={32} round />
            <ShareCount>{shareCount.pinterest}</ShareCount>
          </PinterestShareButton>
        </IconWrapper>

        <IconWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <WhatsappShareButton url={currentUrl} title={shareTitle} onClick={() => handleShare('whatsapp')}>
            <WhatsappIcon size={32} round />
            <ShareCount>{shareCount.whatsapp}</ShareCount>
          </WhatsappShareButton>
        </IconWrapper>
      </ShareButtons>

      <CopyLinkButton
        onClick={copyToClipboard}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </CopyLinkButton>

      <ShareAnalytics>
        <h4>Share Analytics</h4>
        <p>Total Shares: {Object.values(shareCount).reduce((a, b) => a + b, 0)}</p>
        {/* Add more analytics as needed */}
      </ShareAnalytics>
    </ShareContainer>
  );
};

export default SocialShare; 