import axios, { AxiosError} from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiResponse, ApiError } from '@typings/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const customError: ApiError = {
          success: false,
          error: error.response?.data?.error || error.message || 'An error occurred',
          statusCode: error.response?.status || 500,
          timestamp: new Date().toISOString(),
        };
        return Promise.reject(customError);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    // Make API call to backend
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  async post<T>(url: string, data?: Record<string, any>): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }
}

export const apiService = new ApiService();
export default apiService;
