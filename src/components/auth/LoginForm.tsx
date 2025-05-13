import React, { useState } from 'react';
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
  Checkbox,
} from '@chakra-ui/react';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useAuth from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const email = useInput({
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  });
  
  const password = useInput({
    validator: (value) => value.length >= 6,
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const success = await login(email.value, password.value, rememberMe);

    if (success) {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
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
          <FormLabel htmlFor="login-email" className="text-neutral-700">Email address</FormLabel>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
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
          <FormLabel htmlFor="login-password" className="text-neutral-700">Password</FormLabel>
          <InputGroup>
            <Input
              id="login-password"
              name="password"
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

        <Checkbox
          id="remember-me"
          name="remember-me"
          isChecked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="text-neutral-700"
        >
          Remember me
        </Checkbox>

        <Button 
          type="submit"
          className="w-full mt-6 bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In</span>
        </Button>

        <Text className="text-sm text-neutral-600 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </Text>
      </form>
    </Box>
  );
};

export default LoginForm;