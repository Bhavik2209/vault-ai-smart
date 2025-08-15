import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchResult } from '@/contexts/AppContext';

export const SearchBar: React.FC = () => {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    dispatch({ type: 'SET_SEARCHING', payload: true });

    try {
      // Simulate AI search delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock search results - in real app, this would call the FastAPI backend
      const mockResults: SearchResult[] = state.files
        .filter(file => 
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(file => ({
          ...file,
          snippet: `This file matches your search for "${searchQuery}". Found in file content or metadata.`,
          relevanceScore: Math.random(),
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: mockResults });
    } catch (error) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files using natural language... (e.g., 'show me invoices from last month')"
            value={query}
            onChange={handleInputChange}
            disabled={state.isSearching}
            className="form-search pl-12 pr-24 text-base h-14"
          />
          <Button
            type="submit"
            disabled={!query.trim() || state.isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
          >
            {state.isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </form>

      {/* Search suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          'images from this week',
          'PDF documents',
          'video files',
          'recent uploads',
          'large files',
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery(suggestion);
              performSearch(suggestion);
            }}
            disabled={state.isSearching}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};