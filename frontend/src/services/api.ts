export const API_BASE_URL = "http://localhost:3100";

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  _id: string;
  kid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  clients: string[];
  roles: Array<{
    id: string;
    title: string;
    client_id: string;
  }>;
  groups: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    const token = localStorage.getItem("access_token");
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: "خطای ناشناخته رخ داد",
          statusCode: response.status,
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("خطا در برقراری ارتباط با سرور");
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getUserInfo(): Promise<UserProfile> {
    return this.makeRequest<UserProfile>("/user/get-info", {
      method: "GET",
    });
  }
}

export const apiService = new ApiService();
