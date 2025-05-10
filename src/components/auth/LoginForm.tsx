import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { loginSuccess } from '../../store/slices/authSlice';
import { mockUsers } from '../../mockData/userData';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = React.useState(false);

  const email = useInput({
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  });
  
  const password = useInput({
    validator: (value) => value.length >= 6,
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.isValid || !password.isValid) {
      toast({
        title: 'Invalid input',
        description: 'Please check your email and password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const user = mockUsers.find((u) => u.email.toLowerCase() === email.value.toLowerCase());

    if (user) {
      dispatch(loginSuccess(user));
      navigate('/dashboard');
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Try with john@example.com.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl animate-slide-up">
      <VStack className="space-y-6 items-center mb-8">
        <Flex className="items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <Heading className="ml-2 text-2xl text-primary-700">Learning Tracker</Heading>
        </Flex>
        <Text className="text-neutral-600 text-center">
          Sign in to access your learning dashboard and track your progress.
        </Text>
      </VStack>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl isInvalid={email.hasError}>
          <FormLabel className="text-neutral-700">Email address</FormLabel>
          <Input
            type="email"
            placeholder="Your email"
            value={email.value}
            onChange={email.onChange}
            onBlur={email.onBlur}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {email.hasError && (
            <FormErrorMessage className="text-error-500 text-sm mt-1">
              Please enter a valid email address
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={password.hasError}>
          <FormLabel className="text-neutral-700">Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <InputRightElement>
              <Button
                onClick={handleTogglePassword}
                className="p-1 hover:bg-neutral-100 rounded-full"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {password.hasError && (
            <FormErrorMessage className="text-error-500 text-sm mt-1">
              Password must be at least 6 characters
            </FormErrorMessage>
          )}
        </FormControl>

        <Button 
          type="submit"
          className="w-full mt-6 bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In</span>
        </Button>

      </form>
    </Box>
  );
};

export default LoginForm;