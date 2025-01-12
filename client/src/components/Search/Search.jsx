import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const ResultItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ResultImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultName = styled.h4`
  margin: 0;
  color: #1a1a1a;
`;

const ResultPrice = styled.p`
  margin: 0.25rem 0 0;
  color: #666;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: ${props => props.active ? '#1a1a1a' : 'white'};
  color: ${props => props.active ? 'white' : '#1a1a1a'};
  cursor: pointer;
`;

const Search = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all'
  });

  // Simulated search function
  const searchProducts = async (searchQuery) => {
    // Replace with actual API call
    const mockResults = [
      {
        id: 1,
        name: 'Midnight Rose',
        price: 129.99,
        image: '/images/perfume1.jpg',
        category: 'floral'
      },
      // Add more mock results...
    ];
    
    return mockResults.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts(debouncedQuery).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <FilterSection>
        {['all', 'floral', 'woody', 'fresh'].map(category => (
          <FilterButton
            key={category}
            active={filters.category === category}
            onClick={() => setFilters({ ...filters, category })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterSection>

      <AnimatePresence>
        {results.length > 0 && (
          <SearchResults
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {results.map(result => (
              <ResultItem
                key={result.id}
                onClick={() => onSelect(result)}
                whileHover={{ x: 5 }}
              >
                <ResultImage src={result.image} alt={result.name} />
                <ResultInfo>
                  <ResultName>{result.name}</ResultName>
                  <ResultPrice>${result.price}</ResultPrice>
                </ResultInfo>
              </ResultItem>
            ))}
          </SearchResults>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
};

export default Search; 