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
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { mockUsers } from '../../mockData/userData';
import { User } from '../../types';

const AllEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchEmployees = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(mockUsers);
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));

  return (
    <Box className="p-6">
      <Heading size="lg" className="mb-2">All Employees</Heading>
      <Text className="text-neutral-600 mb-6">
        Manage and view all employees in the organization
      </Text>

      <Box className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Box className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              placeholder="All Departments"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full md:w-48"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
          </div>
        </Box>

        <div className="overflow-x-auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Employee</Th>
                <Th>Department</Th>
                <Th>Role</Th>
                <Th>Manager</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees.map(employee => (
                <Tr key={employee.id}>
                  <Td>
                    <div className="flex items-center space-x-3">
                      <Avatar
                        size="md"
                        name={employee.name}
                        src={employee.avatarUrl}
                        className="rounded-lg"
                      />
                      <div>
                        <Text className="font-medium">{employee.name}</Text>
                        <Text className="text-sm text-neutral-600">{employee.email}</Text>
                      </div>
                    </div>
                  </Td>
                  <Td>{employee.department}</Td>
                  <Td>
                    <Badge
                      className={`capitalize ${
                        employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        employee.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {employee.role}
                    </Badge>
                  </Td>
                  <Td>
                    {employee.managerId ? (
                      <Text>
                        {mockUsers.find(u => u.id === employee.managerId)?.name || 'Unknown'}
                      </Text>
                    ) : (
                      <Text className="text-neutral-500">-</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Box>
    </Box>
  );
};

export default AllEmployeesPage;