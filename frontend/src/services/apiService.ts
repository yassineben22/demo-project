import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '../environment/environment';
import { BaseApiResponse, ApiErrorResponse } from '../types/response';
import { BaseApiRequest } from '../types/request';

class ApiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: environment.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false, 
      timeout: 10000, 
    });
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: config.headers,
          data: config.data
        });

        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );   
    this.api.interceptors.response.use(
      (response: AxiosResponse<BaseApiResponse>) => {
        console.log('✅ API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
        return response;
      },
      (error) => {
        console.error('❌ API Error:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            method: error.config?.method,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A'
          }
        });

        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }
  public async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    requestData?: BaseApiRequest<any>
  ): Promise<BaseApiResponse<T>> {
    try {
      const response = await this.api({
        method,
        url,
        data: requestData,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiErrorResponse;
      }
      throw {
        statusCode: '500',
        statusMessage: error.message || 'Network error',
        statusLabel: 'Request failed',
        responseData: null,
      } as ApiErrorResponse;
    }
  }
}

export const apiService = new ApiService();
