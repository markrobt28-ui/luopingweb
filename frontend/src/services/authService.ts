import { apiRequest, authApiRequest } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // 登录
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await apiRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    // 存储token和用户信息
    this.setTokens(response.accessToken, response.refreshToken);
    this.setUser(response.user);
    
    return response;
  }

  // 注册
  async register(registerData: RegisterData): Promise<{ message: string; user: User }> {
    const response = await apiRequest('auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    return response;
  }

  // 登出
  async logout(): Promise<void> {
    try {
      await authApiRequest('auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('登出请求失败:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // 刷新token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('没有可用的刷新token');
    }

    const response = await apiRequest('auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  // 获取用户信息
  async getProfile(): Promise<User> {
    return await authApiRequest('profile');
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // 检查token是否过期（简单检查）
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Token管理方法
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authService = new AuthService();