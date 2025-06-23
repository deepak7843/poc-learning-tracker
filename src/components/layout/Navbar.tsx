import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Divider
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { BookOpen, LogOut, Menu as MenuIcon, User, UserCheck, Shield } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout, updateRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleRoleChange = (role: 'user' | 'manager' | 'admin') => {
    updateRole(role);
  };

  return (
    <Box className="bg-primary-700 sticky top-0 z-40">
      <Flex className="justify-between items-center max-w-7xl mx-auto h-16 px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-white" />
            <Heading size="md" className="text-white tracking-tight zf-font-prometo-md">
              Learning Tracker 
            </Heading>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <div className="flex items-center space-x-1.5">
                <Text className="capitalize zf-font-prometo-light">{user?.role}</Text>
                <MenuIcon className="w-4 h-4 opacity-70" />
              </div>
            </MenuButton>
            <MenuList className="mt-2">
              <MenuItem
                onClick={() => handleRoleChange('user')}
                className="hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <Text className="text-gray-700 zf-font-prometo-light">User</Text>
                </div>
              </MenuItem>
              <MenuItem
                onClick={() => handleRoleChange('manager')}
                className="hover:bg-blue-50"
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <Text className="text-blue-700 zf-font-prometo-light">Manager</Text>
                </div>
              </MenuItem>
              <MenuItem
                onClick={() => handleRoleChange('admin')}
                className="hover:bg-purple-50"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <Text className="text-purple-700 zf-font-prometo-light">Admin</Text>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              variant="unstyled"
              className="hover:opacity-90"
            >
              <Avatar
                name={user?.name}
                src={user?.avatarUrl}
                size="sm"
                className="rounded-lg"
              />
            </MenuButton>
            <MenuList className="mt-2">
              <Box className="px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <Text className="text-gray-900 zf-font-prometo-md">{user?.name}</Text>
                  <Text className="text-sm text-gray-500 zf-font-prometo-light">{user?.email}</Text>
                </div>
              </Box>
              <Divider />
              <MenuItem className="hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <Text className="text-gray-700 zf-font-prometo-light">View Profile</Text>
                </div>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                className="hover:bg-red-50"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <Text className="text-red-600 zf-font-prometo-light">Sign Out</Text>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>
    </Box>
  );
};

export default Navbar;