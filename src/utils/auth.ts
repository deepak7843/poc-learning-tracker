// import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Short-lived access token (15 minutes)
export const generateToken = (payload: Omit<JWTPayload, 'exp'>) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 15 * 60; // 15 minutes
  const tokenPayload = { ...payload, exp };
  return btoa(JSON.stringify(tokenPayload)); //(Base64 encode)
};

// Long-lived refresh token (7 days)
export const generateRefreshToken = (userId: string) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 60 * 60; // 7 days
  const payload = { userId, exp };
  return btoa(JSON.stringify(payload));
};

export const setTokens = (token: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getTokens = () => {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const refreshAuthToken = (userId: string, email: string, role: string) => {
  const token = generateToken({ id: userId, email, role });
  const refreshToken = generateRefreshToken(userId);
  setTokens(token, refreshToken);
  return { token, refreshToken };
};