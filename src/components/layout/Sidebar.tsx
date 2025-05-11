import React from 'react';
import { Box, VStack, Link, Text, Divider, Icon, Flex } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LayoutDashboard, BookOpen, Clock, Users, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Topics', path: '/topics', icon: BookOpen },
    { name: 'Timeline', path: '/timeline', icon: Clock },
  ];

  const managerMenuItems = [
    { name: 'Reporting Employees', path: '/reporting-employees', icon: Users },
  ];

  const adminMenuItems = [
    { name: 'All Employees', path: '/employees', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const additionalMenuItems = 
    user?.role === 'admin'
      ? adminMenuItems
      : user?.role === 'manager'
        ? managerMenuItems
        : [];

  return (
    <Box className="h-full overflow-y-auto border-r border-neutral-200 p-4">
      <VStack className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            as={NavLink}
            to={item.path}
            className={`w-full py-3 px-4 rounded-md font-medium flex items-center transition-colors
              ${location.pathname === item.path 
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-800'}`}
          >
            <Icon as={item.icon} className="w-5 h-5 mr-3" />
            <Text>{item.name}</Text>
          </Link>
        ))}
      </VStack>

      {additionalMenuItems.length > 0 && (
        <>
          <Divider className="my-4" />
          <Text className="text-xs text-neutral-500 font-semibold uppercase px-4 mb-2">
            {user?.role === 'admin' ? 'Admin' : 'Management'}
          </Text>
          <VStack className="space-y-1">
            {additionalMenuItems.map((item) => (
              <Link
                key={item.path}
                as={NavLink}
                to={item.path}
                className={`w-full py-3 px-4 rounded-md font-medium flex items-center transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-800'}`}
              >
                <Icon as={item.icon} className="w-5 h-5 mr-3" />
                <Text>{item.name}</Text>
              </Link>
            ))}
          </VStack>
        </>
      )}

      <Flex className="mt-8 p-4 justify-center">
        <Text className="text-sm text-neutral-500">
          Learning Tracker v1.0
        </Text>
      </Flex>
    </Box>
  );
};

export default Sidebar;