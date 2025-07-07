import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useAuth from '../hooks/useAuth';
import authReducer from '../store/slices/authSlice';
import * as authUtils from '../utils/auth';
import { mockUsers } from '../mockData/userData';

vi.mock('../utils/auth', () => ({
  generateToken: vi.fn().mockReturnValue('mock-token'),
  generateRefreshToken: vi.fn().mockReturnValue('mock-refresh-token'),
  setTokens: vi.fn(),
  getTokens: vi.fn().mockReturnValue({ token: null, refreshToken: null }),
  removeTokens: vi.fn(),
  isTokenValid: vi.fn().mockReturnValue(true),
  refreshAuthToken: vi.fn().mockReturnValue({ token: 'new-mock-token' }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.atob = vi.fn((str) => Buffer.from(str, 'base64').toString('binary'));
global.btoa = vi.fn((str) => Buffer.from(str, 'binary').toString('base64'));

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('initializes with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
  
  it('handles login successfully', async () => {
    vi.mocked(authUtils.setTokens).mockImplementation(() => {});
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      const success = await result.current.login('user@example.com', 'password123');
      expect(success).toBe(true);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(authUtils.setTokens).toHaveBeenCalled();
    expect(authUtils.generateToken).toHaveBeenCalled();
  });
  
  it('handles login failure with incorrect credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      const success = await result.current.login('wrong@example.com', 'wrongpassword');
      expect(success).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
  
  it('handles signup successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      const success = await result.current.signup('New User', 'newuser@example.com', 'password123');
      expect(success).toBe(true);
    });
    
    const storedUsers = JSON.parse(localStorageMock.getItem('users') || '[]');
    expect(storedUsers.some((u: any) => u.email === 'newuser@example.com')).toBe(true);
  });
  
  it('prevents signup with existing email', async () => {
    localStorageMock.setItem('users', JSON.stringify(mockUsers));
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      const success = await result.current.signup('Duplicate User', mockUsers[0].email, 'password123');
      expect(success).toBe(false);
    });
  });
  
  it('handles logout correctly', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      await result.current.login('user@example.com', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(authUtils.removeTokens).toHaveBeenCalled();
  });
  
  it('checks authentication on mount with valid token', async () => {
    vi.mocked(authUtils.getTokens).mockReturnValue({ 
      token: 'valid-token', 
      refreshToken: null 
    });
    
    vi.mocked(global.atob).mockReturnValue(JSON.stringify({ 
      email: mockUsers[0].email,
      userId: mockUsers[0].id,
      role: mockUsers[0].role
    }));
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe(mockUsers[0].email);
  });
  
  it('refreshes token when current token is invalid', async () => {
    vi.mocked(authUtils.getTokens).mockReturnValue({ 
      token: 'invalid-token', 
      refreshToken: 'valid-refresh-token' 
    });
    
    vi.mocked(authUtils.isTokenValid).mockImplementation((token) => {
      return token === 'valid-refresh-token';
    });
    
    localStorageMock.setItem('refresh_token', 'valid-refresh-token');
    localStorageMock.setItem('rememberMe', 'true');
    
    vi.mocked(global.atob).mockReturnValue(JSON.stringify({ 
      userId: mockUsers[0].id,
      email: mockUsers[0].email,
      role: mockUsers[0].role
    }));
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(authUtils.refreshAuthToken).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
  });
  
  it('handles authentication errors gracefully', async () => {
    vi.mocked(authUtils.getTokens).mockReturnValue({ 
      token: 'error-token', 
      refreshToken: null 
    });
    
    vi.mocked(global.atob).mockImplementation(() => {
      throw new Error('Invalid token format');
    });
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});
