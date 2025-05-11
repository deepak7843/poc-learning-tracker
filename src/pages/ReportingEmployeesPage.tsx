import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Heading, Text, Avatar, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import { RootState } from '../store';
import { User } from '../types';
import { mockUsers } from '../mockData/userData';

const ReportingEmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reportingEmployees, setReportingEmployees] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      const employees = mockUsers.filter(u => u.managerId === user.id);
      setReportingEmployees(employees);
    }
  }, [user]);

  const handleViewTimeline = (employeeId: string) => {
    navigate(`/employee/${employeeId}/timeline`);
  };

  return (
    <Box className="p-4 md:p-6">
      <Box className="mb-6">
        <Heading size="lg" className="mb-2">Reporting Employees</Heading>
        <Text className="text-gray-600">
          Manage and track the learning progress of your team members
        </Text>
      </Box>

      <Box className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {reportingEmployees.length > 0 ? (
            <Table>
              <Thead>
                <Tr>
                  <Th className="whitespace-nowrap">Employee</Th>
                  <Th className="whitespace-nowrap">Department</Th>
                  <Th className="whitespace-nowrap">Role</Th>
                  <Th className="whitespace-nowrap">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reportingEmployees.map((employee) => (
                  <Tr key={employee.id}>
                    <Td className="min-w-[240px]">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="md"
                          name={employee.name}
                          src={employee.avatarUrl}
                          className="rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Text className="font-medium truncate">{employee.name}</Text>
                          <Text className="text-sm text-gray-500 truncate">{employee.email}</Text>
                        </div>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">{employee.department}</Td>
                    <Td className="whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                        {employee.role}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewTimeline(employee.id)}
                          className="flex items-center justify-center space-x-2 min-w-[100px]"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Timeline</span>
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Box className="p-8 text-center">
              <Text className="text-gray-600">No reporting employees found</Text>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default ReportingEmployeesPage;