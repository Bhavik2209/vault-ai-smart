import React from 'react';
import { FileText, Image, Video, FileArchive, Music, ExternalLink, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('archive') || type.includes('zip')) return FileArchive;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface SearchResultCardProps {
  result: SearchResult;
  onOpen: (result: SearchResult) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onOpen }) => {
  const Icon = getFileIcon(result.type);

  const handleOpen = () => {
    onOpen(result);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Download started',
      description: `Downloading ${result.name}`,
    });
  };

  return (
    <div className="search-result animate-fade-in" onClick={handleOpen}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-medium text-foreground truncate">{result.name}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span>{formatFileSize(result.size)}</span>
            <span>•</span>
            <span>{result.type}</span>
            <span>•</span>
            <span>{result.uploadedAt.toLocaleDateString()}</span>
            {result.relevanceScore && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">
                  {Math.round(result.relevanceScore * 100)}% match
                </span>
              </>
            )}
          </div>
          
          {result.snippet && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {result.snippet}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface SearchResultsProps {
  filter: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ filter }) => {
  const { state } = useApp();

  const handleOpenResult = (result: SearchResult) => {
    if (result.path) {
      toast({
        title: 'Opening file',
        description: `Opening ${result.name}`,
      });
      console.log('Opening search result:', result);
    }
  };

  // Filter results based on selected filter
  const filteredResults = state.searchResults.filter(result => {
    if (filter === 'all') return true;
    if (filter === 'images') return result.type.startsWith('image/');
    if (filter === 'pdfs') return result.type === 'application/pdf';
    if (filter === 'videos') return result.type.startsWith('video/');
    return true;
  });

  if (state.isSearching) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="search-result animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">
          Search Results ({filteredResults.length})
        </h3>
      </div>
      
      <div className="grid gap-4">
        {filteredResults.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
            onOpen={handleOpenResult}
          />
        ))}
      </div>
    </div>
  );
};