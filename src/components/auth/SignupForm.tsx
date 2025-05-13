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
    Link as ChakraLink,
} from '@chakra-ui/react';
import { Eye, EyeOff, UserPlus, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useAuth from '../../hooks/useAuth';

const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { signup } = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);

    const name = useInput({
        validator: (value) => value.length >= 2,
    });

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

        if (!name.isValid || !email.isValid || !password.isValid) {
            toast({
                title: 'Invalid input',
                description: 'Please check your input fields.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const success = await signup(name.value, email.value, password.value);

        if (success) {
            toast({
                title: 'Account created',
                description: 'Welcome to Learning Tracker!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/dashboard');
        } else {
            toast({
                title: 'Signup failed',
                description: 'Email already exists. Please try a different email.',
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
                    Create your account to start tracking your learning journey.
                </Text>
            </VStack>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormControl isInvalid={name.hasError}>
                    <FormLabel className="text-neutral-700">Full Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Your Name"
                        value={name.value}
                        onChange={name.onChange}
                        onBlur={name.onBlur}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                    {name.hasError && (
                        <FormErrorMessage className="text-error-500 text-sm mt-1">
                            Name must be at least 2 characters
                        </FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={email.hasError}>
                    <FormLabel className="text-neutral-700">Email address</FormLabel>
                    <Input
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
                    <FormLabel className="text-neutral-700">Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
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
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                </Button>

                <Text className="text-sm text-neutral-600 text-center mt-4">
                    Already have an account?{' '}
                    <ChakraLink as={Link} to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        Sign in
                    </ChakraLink>
                </Text>
            </form>
        </Box>
    );
};

export default SignupForm;