import React, { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';
import { useApp } from '@/contexts/AppContext';

export const SearchPage: React.FC = () => {
  const { state } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Bar */}
      <section>
        <SearchBar />
      </section>

      {/* Filters */}
      <section>
        <SearchFilters 
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </section>

      {/* Results */}
      <section>
        <SearchResults filter={selectedFilter} />
      </section>

      {/* Empty State */}
      {state.searchResults.length === 0 && !state.isSearching && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Search your files</h3>
          <p className="text-muted-foreground">
            Use natural language to find exactly what you're looking for
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try: "show me invoices from last month" or "find presentation files"
          </p>
        </div>
      )}
    </div>
  );
};