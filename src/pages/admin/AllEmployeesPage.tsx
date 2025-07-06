import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Input,
  Select,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { User } from '../../types';

const MOCK_API_URL = 'https://62b2d6364f851f87f44ddc8b.mockapi.io/users';

const AllEmployeesPage: React.FC = () => {
  const [allEmployees, setAllEmployees] = useState<User[]>([]);
  const [displayedEmployees, setDisplayedEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(MOCK_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch data from mock API');
        }
        const data: User[] = await response.json();
        setAllEmployees(data);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Streaming the fetched data on ui
  useEffect(() => {
    if (allEmployees.length === 0) return;

    setDisplayedEmployees([]); // Clearing previous list before streaming new one
    const interval = setInterval(() => {
      setDisplayedEmployees(prev => {
        if (prev.length < allEmployees.length) {
          return [...prev, allEmployees[prev.length]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 300);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [allEmployees]);

  const filteredEmployees = displayedEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(allEmployees.map(e => e.department).filter(Boolean)));

  return (
    <Box className="p-6">
      <Heading as="h1" size="xl" mb={2}>
        All Employees
      </Heading>
      <Text mb={6} color="gray.500">
        Manage and view all employees in the organization
      </Text>

      <Box display="flex" mb={6} gap={4}>
        <Box flex={1} position="relative">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pl={10}
          />
          <Box as={Search} size={20} color="gray.400" position="absolute" left={3} top="50%" transform="translateY(-50%)" />
        </Box>
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          maxW="200px"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </Select>
      </Box>

      <Box position="relative" minH="400px">
        {isLoading ? (
          <Center h="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Employee</Th>
                <Th>Department</Th>
                <Th>Role</Th>
                <Th>Manager</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees.map((employee) => (
                <Tr key={employee.id}>
                  <Td>
                    <Box display="flex" alignItems="center">
                      <Avatar size="sm" name={employee.name} src={employee.avatarUrl} mr={3} />
                      <Box>
                        <Text fontWeight="bold">{employee.name}</Text>
                        <Text fontSize="sm" color="gray.500">{employee.email}</Text>
                      </Box>
                    </Box>
                  </Td>
                  <Td>{employee.department}</Td>
                  <Td>
                    <Badge colorScheme={employee.role === 'manager' ? 'blue' : 'green'}>
                      {employee.role?.toUpperCase() || 'N/A'}
                    </Badge>
                  </Td>
                  <Td>
                    {employee.managerId ? (
                      <Text>
                        {allEmployees.find(u => u.id === employee.managerId)?.name || 'Unknown'}
                      </Text>
                    ) : (
                      <Text className="text-neutral-500">-</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default AllEmployeesPage;