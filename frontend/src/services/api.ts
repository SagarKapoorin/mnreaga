import axios, { AxiosError} from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiResponse, ApiError } from '@typings/api.types';
// Fake data for development
import { fakeDistricts, fakeCurrent, fakeHistory, fakeComparison } from '@/data/fakeData';

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
    // Development-only stub
    if (true) {
      const path = url.startsWith('/') ? url.slice(1) : url;
      const parts = path.split('/');
      // GET /districts
      if (parts[0] === 'districts' && parts.length === 1) {
        return fakeDistricts as unknown as T;
      }
      // GET /districts/current (all districts current performance)
      if (parts[0] === 'districts' && parts[1] === 'current' && parts.length === 2) {
        return Object.values(fakeCurrent) as unknown as T;
      }
      // GET /districts/:code
      if (parts[0] === 'districts' && parts.length === 2) {
        const code = parts[1];
        const data = fakeCurrent[code] || Object.values(fakeCurrent)[0];
        return data as unknown as T;
      }
      // GET /districts/:code/history
      if (parts[0] === 'districts' && parts[2] === 'history') {
        const code = parts[1];
        const data = fakeHistory[code] || Object.values(fakeHistory)[0];
        return data as unknown as T;
      }
      // GET /districts/:code/comparison or compare
      if (
        parts[0] === 'districts' &&
        (parts[2] === 'comparison' || parts[2] === 'compare')
      ) {
        const code = parts[1];
        const data = fakeComparison[code] || Object.values(fakeComparison)[0];
        return data as unknown as T;
      }
    }
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
