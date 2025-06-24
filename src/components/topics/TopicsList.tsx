import React, { useCallback, useEffect, useState } from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../store'; 
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { fetchTopics, setSearchTerm, clearSearch } from '../../store/slices/topicsSlice';
import { fetchUserLearnings } from '../../store/slices/learningsSlice';
import { TopicWithProgress } from '../../types';
import TopicCard from './TopicCard';
import SearchBar from './SearchBar';
import TopicsFilter from './TopicsFilter';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 4;

const TopicsList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { topics, filteredTopics, loading, searchTerm } = useSelector((state: RootState) => state.topics);
  const { learnings } = useSelector((state: RootState) => state.learnings);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      dispatch(fetchTopics());
      dispatch(fetchUserLearnings(user.id));
    }
  }, [dispatch, user]);

  const categories = [...new Set(topics.map((topic) => topic.category))];
  
  //attaching progress in all mock topicData from learningsData
  const topicsWithProgress: TopicWithProgress[] = filteredTopics.map((topic) => {
    const learning = learnings.find((l) => l.topicId === topic.id);
    return {
      ...topic,
      progress: learning?.progress || 0,
      status: learning?.status || 'not_started',
    };
  });

  const filteredByCategories = categoryFilter
    ? topicsWithProgress.filter((topic) => topic.category === categoryFilter)
    : topicsWithProgress;

  const fullyFilteredTopics = difficultyFilter
    ? filteredByCategories.filter((topic) => topic.difficulty === difficultyFilter)
    : filteredByCategories;

  const totalPages = Math.ceil(fullyFilteredTopics.length / ITEMS_PER_PAGE);
  const paginatedTopics = fullyFilteredTopics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchTerm(value));
    setCurrentPage(1);
  }, [dispatch]);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  }, []);

  const handleDifficultyChange = useCallback((value: string) => {
    setDifficultyFilter(value);
    setCurrentPage(1);
  }, []);
    
  const clearFilters = useCallback( () => {
    setCategoryFilter('');
    setDifficultyFilter('');
    dispatch(clearSearch());
    setCurrentPage(1);
  }, [dispatch]);

  const handleTopicSelect = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Box key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
            <div className="flex">
              <div className="w-1/3 h-48 bg-gray-200" />
              <div className="flex-1 p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-24" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </Box>
        ))}
      </div>
    );
  }

  return (
    <Box className="w-full max-w-7xl mx-auto">
      <Flex className="items-center justify-between mb-6">
        <Box>
          <Heading className="text-2xl text-gray-900 zf-font-prometo-md">Learning Topics</Heading>
          <Text className="text-gray-600 mt-1 zf-font-prometo-light">Browse and search through available learning topics</Text>
        </Box>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 zf-font-prometo-md"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </Flex>

      <Box className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={() => dispatch(clearSearch())}
              />
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'}`}>
              <TopicsFilter
                categories={categories}
                categoryFilter={categoryFilter}
                difficultyFilter={difficultyFilter}
                onCategoryChange={handleCategoryChange}
                onDifficultyChange={handleDifficultyChange}
              />
            </div>
          </div>
        </div>

        <ActiveFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          difficultyFilter={difficultyFilter}
          onClearSearch={() => dispatch(clearSearch())}
          onClearCategory={() => setCategoryFilter('')}
          onClearDifficulty={() => setDifficultyFilter('')}
          onClearAll={clearFilters}
        />
      </Box>

      {paginatedTopics.length > 0 ? (
        <>
          <div className="space-y-6">
            {paginatedTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Box className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Box className="max-w-md mx-auto">
            <Heading as="h3" className="text-lg text-gray-900 mb-2 zf-font-prometo-md">
              No topics found
            </Heading>
            <Text className="text-gray-600 mb-6 zf-font-prometo-light">
              {searchTerm || categoryFilter || difficultyFilter
                ? 'Try adjusting your search or filters'
                : 'No learning topics are available yet'}
            </Text>
            {(searchTerm || categoryFilter || difficultyFilter) && (
              <Button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 zf-font-prometo-md"
              >
                Clear all filters
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TopicsList;