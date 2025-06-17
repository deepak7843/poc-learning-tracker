import React from 'react';
import { Select } from '@chakra-ui/react';

interface TopicsFilterProps {
  categories: string[];
  categoryFilter: string;
  difficultyFilter: string;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
}

const TopicsFilter: React.FC<TopicsFilterProps> = ({
  categories,
  categoryFilter,
  difficultyFilter,
  onCategoryChange,
  onDifficultyChange,
}) => {
  return (
    <div className="flex gap-4">
      <Select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full md:w-48 px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors zf-font-prometo-light"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>

      <Select
        value={difficultyFilter}
        onChange={(e) => onDifficultyChange(e.target.value)}
        className="w-full md:w-48 px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors zf-font-prometo-light"
      >
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </Select>
    </div>
  );
};

export default TopicsFilter;