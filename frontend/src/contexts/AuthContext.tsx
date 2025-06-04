import { createContext, useContext, useEffect, useState } from "react";
import { apiService, type UserProfile } from "../services/api";

// Constants for localStorage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (accessToken) {
        // Try to fetch user info from API
        await fetchUserInfo();
      } else if (refreshToken) {
        // Try to refresh the token
        await refreshAuthToken();
        await fetchUserInfo();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear invalid tokens
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await apiService.getUserInfo();
      setUser(userInfo);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await apiService.refreshToken(refreshToken);

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearAuthData();
      throw error;
    }
  };

  const clearAuthData = () => {
    // Clear all auth-related data from localStorage
    const keysToRemove = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
      // Legacy keys that might exist
      "accessToken",
      "refreshToken",
      "isAuthenticated",
      "authToken",
      "token",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    setUser(null);
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ username, password });

      // Clear any existing auth data first
      clearAuthData();

      // Store new tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

      // Fetch user information from API
      await fetchUserInfo();
    } catch (error) {
      console.error("Login error:", error);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(data);

      // Clear any existing auth data first
      clearAuthData();

      // Store new tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

      // Fetch user information from API
      await fetchUserInfo();
    } catch (error) {
      console.error("Registration error:", error);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserInfo = async () => {
    try {
      await fetchUserInfo();
    } catch (error) {
      console.error("Error refreshing user info:", error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();

    // Additional cleanup - remove any other potential auth-related items
    // This is a more aggressive cleanup to ensure nothing remains
    const allKeys = Object.keys(localStorage);
    const authRelatedPatterns = [/token/i, /auth/i, /user/i, /session/i];

    allKeys.forEach((key) => {
      if (authRelatedPatterns.some((pattern) => pattern.test(key))) {
        localStorage.removeItem(key);
      }
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
