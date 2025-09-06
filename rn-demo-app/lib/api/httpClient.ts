import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { dynamicClient } from "@/lib/clients/dynamic";

// API Response tiplerini tanımlayalım
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Base configuration
const BASE_URL = __DEV__
  ? "http://192.168.1.232:8080" // development URL
  : "https://api.awsdemoapp.com"; // production URL

const DEFAULT_TIMEOUT = 10000;

class HttpClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - her request'e token ekle
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = dynamicClient.auth.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Token alınırken hata:", error);
        }

        // Request log (development ortamında)
        if (__DEV__) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - hata yönetimi ve log
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Response log (development ortamında)
        if (__DEV__) {
          console.log(
            `✅ ${response.status} ${response.config.url}`,
            response.data
          );
        }

        return response; // Response'u ApiResponse tipine dönüştür
      },
      async (error: AxiosError) => {
        // Response error log
        if (__DEV__) {
          console.error(
            `❌ ${error.response?.status} ${error.config?.url}`,
            error.response?.data
          );
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: "Bilinmeyen bir hata oluştu",
      status: 500,
    };

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.message = (error.response.data as any)?.message || error.message;
      apiError.details = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = "Sunucuya bağlanılamadı";
      apiError.status = 0;
    } else {
      // Something happened in setting up the request
      apiError.message = error.message;
    }

    return apiError;
  }

  // HTTP Methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  // File upload için özel method
  async uploadFile<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: response.data,
      message: (response.data as any)?.message,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  // Base URL'i değiştirmek için
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }

  // Timeout değiştirmek için
  setTimeout(timeout: number) {
    this.client.defaults.timeout = timeout;
  }

  // Raw axios instance'a erişim (özel durumlar için)
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Singleton instance
const httpClient = new HttpClient();

export default httpClient;
export { HttpClient };
