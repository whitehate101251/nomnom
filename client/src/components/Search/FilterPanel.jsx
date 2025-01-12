import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FilterContainer = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterOption = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PriceInput = styled.input`
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const FilterPanel = ({ filters, selectedFilters, onFilterChange }) => {
  const handleCheckboxChange = (category, value) => {
    onFilterChange(category, value);
  };

  const handlePriceChange = (type, value) => {
    onFilterChange('price', { ...selectedFilters.price, [type]: value });
  };

  return (
    <FilterContainer>
      <FilterSection>
        <FilterTitle>Price Range</FilterTitle>
        <PriceRange>
          <PriceInput
            type="number"
            placeholder="Min"
            value={selectedFilters.price?.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
          />
          <span>-</span>
          <PriceInput
            type="number"
            placeholder="Max"
            value={selectedFilters.price?.max || ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </PriceRange>
      </FilterSection>

      {Object.entries(filters).map(([category, options]) => (
        <FilterSection key={category}>
          <FilterTitle>{category}</FilterTitle>
          <FilterList>
            {options.map((option) => (
              <FilterOption
                key={option.value}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[category]?.includes(option.value)}
                  onChange={() => handleCheckboxChange(category, option.value)}
                />
                {option.label}
                <span>({option.count})</span>
              </FilterOption>
            ))}
          </FilterList>
        </FilterSection>
      ))}
    </FilterContainer>
  );
};

export default FilterPanel; 