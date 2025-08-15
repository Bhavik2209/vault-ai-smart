import React from 'react';
import { Filter, FileImage, FileText, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const filterOptions = [
  { id: 'all', label: 'All Files', icon: Filter },
  { id: 'images', label: 'Images', icon: FileImage },
  { id: 'pdfs', label: 'PDFs', icon: FileText },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
];

interface SearchFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
      
      {filterOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedFilter === option.id;
        
        return (
          <Button
            key={option.id}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(option.id)}
            className="h-8 px-3 text-sm"
          >
            <Icon className="w-4 h-4 mr-2" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};