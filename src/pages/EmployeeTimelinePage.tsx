import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store';
import { Box, Heading, Text, Avatar, Flex, Badge, Button } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { RootState } from '../store';
import TimelineFeed from '../components/timeline/TimelineFeed';
import { User } from '../types';
import { mockUsers } from '../mockData/userData';
import { fetchUserTimeline } from '../store/slices/timelineSlice';

const EmployeeTimelinePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState<User | null>(null);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (currentUser?.role === 'manager' && employeeId) {
      const foundEmployee = mockUsers.find(user => 
        user.id === employeeId && user.managerId === currentUser.id
      );
      if (foundEmployee) {
        setEmployee(foundEmployee);
        dispatch(fetchUserTimeline(employeeId));
      } else {
        navigate('/reporting-employees');
      }
    }
  }, [employeeId, currentUser, navigate, dispatch]);

  if (!employee) {
    return (
      <Box className="p-6">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="p-4 md:p-6">
      <Button
        variant="ghost"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/reporting-employees')}
        className="mb-6"
      >
        Back to Reporting Employees
      </Button>

      <Box className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <Flex className="flex-col md:flex-row md:items-center md:space-x-4">
          <Avatar
            size="xl"
            name={employee.name}
            src={employee.avatarUrl}
            className="rounded-lg mb-4 md:mb-0"
          />
          <Box>
            <Heading size="lg" className="mb-2">{employee.name}</Heading>
            <Text className="text-gray-600 mb-2">{employee.email}</Text>
            <Flex className="flex-wrap gap-2">
              <Badge colorScheme="blue" className="capitalize">
                {employee.department}
              </Badge>
              <Badge colorScheme="green" className="capitalize">
                {employee.role}
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box className="mb-6">
        <Heading size="md" className="mb-2">Learning Timeline</Heading>
        <Text className="text-gray-600">
          Track {employee.name.split(' ')[0]}'s learning progress and achievements
        </Text>
      </Box>

      <TimelineFeed userId={employeeId} />
    </Box>
  );
};

export default EmployeeTimelinePage