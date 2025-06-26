import { apiService } from './apiService';
import {
  LoginRequestData,
  RegisterRequestData,
  createApiRequest,
} from '../types/request';
import {
  AuthResponseData,
  BaseApiResponse,
} from '../types/response';

class AuthService {
  private readonly AUTH_BASE_PATH = '/api/auth';

  async login(credentials: LoginRequestData): Promise<BaseApiResponse<AuthResponseData>> {
    const request = createApiRequest(credentials);
    return apiService.request<AuthResponseData>(
      'POST',
      `${this.AUTH_BASE_PATH}/login`,
      request
    );
  }

  async register(userData: RegisterRequestData): Promise<BaseApiResponse<AuthResponseData>> {
    const request = createApiRequest(userData);
    return apiService.request<AuthResponseData>(
      'POST',
      `${this.AUTH_BASE_PATH}/register`,
      request
    );
  }

  // Utility methods for token management
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  // Store user data
  setUserData(userData: AuthResponseData): void {
    localStorage.setItem('user', JSON.stringify(userData));
    this.setAuthToken(userData.token);
  }

  getUserData(): AuthResponseData | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    this.removeAuthToken();
  }
}

export const authService = new AuthService();
