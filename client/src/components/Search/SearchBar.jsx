import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const SearchButton = styled(motion.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </SearchButton>
      </form>
    </SearchContainer>
  );
};

export default SearchBar; 