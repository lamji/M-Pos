import React, { useState, useEffect } from 'react';

interface SearchProps {
  data: string[]; // Array of items to search from
  onResult: (results: string[]) => void; // Callback to pass filtered results
}

const SearchWithDebounce: React.FC<SearchProps> = ({ data, onResult }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce mechanism
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Filter data based on the debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const filteredData = data.filter((item) =>
        item.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      onResult(filteredData);
    } else {
      onResult([]);
    }
  }, [debouncedQuery, data, onResult]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '16px',
          marginBottom: '10px',
        }}
      />
    </div>
  );
};

export default SearchWithDebounce;
