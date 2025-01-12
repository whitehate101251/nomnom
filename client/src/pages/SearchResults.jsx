import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/Search/SearchBar';
import FilterPanel from '../components/Search/FilterPanel';
import ProductGrid from '../components/Product/ProductGrid';
import SearchService from '../services/search';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Loading from '../components/common/Loading';

const SearchPageContainer = styled.div`
  padding: 2rem;
`;

const SearchContent = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ResultsCount = styled.p`
  color: #666;
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, handleError } = useErrorHandler();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('relevance');

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filterData = await SearchService.getFilters();
        setFilters(filterData);
      } catch (err) {
        handleError(err);
      }
    };
    loadFilters();
  }, [handleError]);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const searchResults = await SearchService.searchProducts({
          query: searchQuery,
          filters: selectedFilters,
          sort: sortBy
        });
        setResults(searchResults);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, selectedFilters, sortBy, handleError]);

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) return <Loading />;

  return (
    <SearchPageContainer>
      <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      
      <SearchContent>
        <FilterPanel
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        
        <div>
          <ResultsHeader>
            <ResultsCount>
              {results.length} results found for "{searchQuery}"
            </ResultsCount>
            <SortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </SortSelect>
          </ResultsHeader>

          <ProductGrid products={results} />
        </div>
      </SearchContent>
    </SearchPageContainer>
  );
};

export default SearchResults; 