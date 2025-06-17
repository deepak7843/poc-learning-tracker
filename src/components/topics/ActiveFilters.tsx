import React from 'react';
import { Badge, Button } from '@chakra-ui/react';
import { XCircle } from 'lucide-react';

interface ActiveFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  difficultyFilter: string;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearDifficulty: () => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  categoryFilter,
  difficultyFilter,
  onClearSearch,
  onClearCategory,
  onClearDifficulty,
  onClearAll,
}) => {
  if (!searchTerm && !categoryFilter && !difficultyFilter) return null;

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {searchTerm && (
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 zf-font-prometo-light">
              Search: {searchTerm}
              <Button
                onClick={onClearSearch}
                className="ml-2 hover:text-blue-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </Badge>
          )}
          {categoryFilter && (
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 zf-font-prometo-light">
              {categoryFilter}
              <Button
                onClick={onClearCategory}
                className="ml-2 hover:text-green-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </Badge>
          )}
          {difficultyFilter && (
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 zf-font-prometo-light">
              {difficultyFilter}
              <Button
                onClick={onClearDifficulty}
                className="ml-2 hover:text-purple-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </Badge>
          )}
        </div>
        <Button
          onClick={onClearAll}
          className="text-sm text-gray-600 hover:text-gray-900 zf-font-prometo-light"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
};

export default ActiveFilters;