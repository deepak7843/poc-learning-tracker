import React from 'react';
import { InputGroup, InputLeftElement, InputRightElement, Input, Button } from '@chakra-ui/react';
import { Search, XCircle } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="flex-grow relative">
      <InputGroup>
        <InputLeftElement>
          <Search className="w-5 h-5 text-gray-400" />
        </InputLeftElement>
        <Input
          placeholder="Search topics by title, description or tags..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors zf-font-prometo-light"
        />
        {value && (
          <InputRightElement>
            <Button
              onClick={onClear}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors zf-font-prometo-light"
            >
              <XCircle className="w-4 h-4 text-gray-500" />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchBar;