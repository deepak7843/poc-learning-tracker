import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User } from '../types';
import { mockUsers } from '../mockData/userData';
import { loginSuccess, logout as logoutAction, updateUserRole } from '../store/slices/authSlice';
import {
  generateToken,
  generateRefreshToken,
  setTokens,
  getTokens,
  removeTokens,
  isTokenValid,
  refreshAuthToken,
} from '../utils/auth';

interface AuthHook {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateRole: (role: 'user' | 'manager' | 'admin') => void;
}

const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const { token } = getTokens();
      const refreshToken = localStorage.getItem('refresh_token');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      if (!token && (!refreshToken || !rememberMe)) {
        handleLogout();
        return;
      }

      try {
        if (token && !isTokenValid(token)) {
          const tokenPayload = refreshToken ? JSON.parse(atob(refreshToken)) : null;
          const storedUser = tokenPayload ? mockUsers.find(u => u.id === tokenPayload.userId) : null;

          if (!storedUser || !refreshToken || !isTokenValid(refreshToken)) {
            handleLogout();
            return;
          }

          const { token: newToken } = refreshAuthToken(
            storedUser.id,
            storedUser.email,
            storedUser.role
          );

          setUser(storedUser);
          setIsAuthenticated(true);
          dispatch(loginSuccess(storedUser));
        } else {
          const payload = JSON.parse(atob(token));
          const storedUser = mockUsers.find(u => u.email === payload.email);

          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
            dispatch(loginSuccess(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        handleLogout();
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogout = () => {
    removeTokens();
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    dispatch(logoutAction());
    // navigate('/login');
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;

    // if email already exists
    if (users.some((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user${Date.now()}`,
      name,
      email,
      role: 'user',
      department: 'General',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken(newUser.id);

    // Store tokens
    setTokens(token, refreshToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('rememberMe', 'true');

    // Update state
    setUser(newUser);
    setIsAuthenticated(true);
    dispatch(loginSuccess(newUser));

    return true;
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    const user = users.find((u: User) => u.email === email);

    if (user) {
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken(user.id);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('refresh_token');
      }

      setTokens(token, refreshToken);
      setUser(user);
      setIsAuthenticated(true);
      dispatch(loginSuccess(user));

      return true;
    }

    return false;
  };

  const updateRole = (role: 'user' | 'manager' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };

      const token = generateToken({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      const refreshToken = generateRefreshToken(updatedUser.id);
      setTokens(token, refreshToken);

      setUser(updatedUser);
      dispatch(updateUserRole(role));

      // Update user in localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: User) => 
          u.id === updatedUser.id ? updatedUser : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout: handleLogout,
    updateRole,
  };
};

export default useAuth;