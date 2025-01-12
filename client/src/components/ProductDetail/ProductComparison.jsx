import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactCompareImage from 'react-compare-image';

const ComparisonSection = styled.section`
  padding: 4rem 0;
  background: #f8f9fa;
`;

const ComparisonContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
  
  &:before {
    content: "✓";
    color: #4CAF50;
    margin-right: 1rem;
  }
`;

const ComparisonFeature = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const FeatureValue = styled.span`
  color: ${props => props.highlight ? '#4CAF50' : '#666'};
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
`;

const ComparisonToggle = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  margin: 0 0.5rem;
  
  &.active {
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  }
`;

const ProductComparison = ({ product1, product2 }) => {
  const [activeFeatures, setActiveFeatures] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('all');

  const compareFeatures = () => {
    const allFeatures = new Set([
      ...Object.keys(product1.features),
      ...Object.keys(product2.features)
    ]);

    return Array.from(allFeatures).map(feature => ({
      name: feature,
      product1Value: product1.features[feature],
      product2Value: product2.features[feature],
      isDifferent: product1.features[feature] !== product2.features[feature]
    }));
  };

  const features = compareFeatures().filter(feature => 
    comparisonMode === 'all' || 
    (comparisonMode === 'differences' && feature.isDifferent)
  );

  return (
    <ComparisonSection>
      <ComparisonContainer>
        <Title>Product Comparison</Title>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ComparisonToggle
            className={comparisonMode === 'all' ? 'active' : ''}
            onClick={() => setComparisonMode('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show All Features
          </ComparisonToggle>
          <ComparisonToggle
            className={comparisonMode === 'differences' ? 'active' : ''}
            onClick={() => setComparisonMode('differences')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show Differences Only
          </ComparisonToggle>
        </div>

        <ComparisonGrid>
          {features.map((feature, index) => (
            <ComparisonFeature
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                const newActiveFeatures = activeFeatures.includes(feature.name)
                  ? activeFeatures.filter(f => f !== feature.name)
                  : [...activeFeatures, feature.name];
                setActiveFeatures(newActiveFeatures);
              }}
            >
              <strong>{feature.name}</strong>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <FeatureValue
                  highlight={feature.isDifferent && feature.product1Value > feature.product2Value}
                >
                  {feature.product1Value || '—'}
                </FeatureValue>
                <FeatureValue
                  highlight={feature.isDifferent && feature.product2Value > feature.product1Value}
                >
                  {feature.product2Value || '—'}
                </FeatureValue>
              </div>
            </ComparisonFeature>
          ))}
        </ComparisonGrid>

        <motion.div 
          style={{ maxWidth: 800, margin: '2rem auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ReactCompareImage
            leftImage={product1.image}
            rightImage={product2.image}
            sliderPositionPercentage={0.5}
            sliderLineWidth={2}
            handleSize={40}
          />
        </motion.div>
      </ComparisonContainer>
    </ComparisonSection>
  );
};

export default ProductComparison; 