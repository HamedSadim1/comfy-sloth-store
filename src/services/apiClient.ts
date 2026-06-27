import type { AxiosInstance, AxiosRequestConfig} from "axios";
import axios, { CanceledError } from "axios";
import { NETWORK, STORAGE_KEYS } from "../constants";

/**
 * Custom error class for API errors.
 */
export class APIError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API response type.
 */
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Wrapper shape returned by dummyjson.com for any list endpoint
 * (`/products`, `/products/category/:slug`, `/products/search`).
 */
export interface DummyProductsResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Axios instance configured for dummyjson.com.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: NETWORK.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new APIError(
        data?.message || `Request failed with status ${status}`,
        status,
        data
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new APIError("Network error - no response received");
    } else {
      // Something else happened
      throw new APIError(error.message || "An unexpected error occurred");
    }
  }
);

/**
 * Generic API client class for making HTTP requests.
 * Provides methods for GET, POST, PUT, DELETE operations.
 */
class APIClient<T> {
  private endpoint: string;

  /**
   * Creates an instance of APIClient.
   * @param endpoint - The API endpoint path (e.g., "/products")
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Fetches all items from a dummyjson list endpoint.
   * The list endpoints return a wrapper { products, total, skip, limit };
   * this method unwraps `.products` for caller convenience.
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to array of items
   */
  async getAll(config?: AxiosRequestConfig): Promise<T[]> {
    try {
      const response = await axiosInstance.get<DummyProductsResponse<T>>(
        this.endpoint,
        config
      );
      return response.data.products;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Returns the full paginated wrapper response (products + total + skip + limit).
   * Useful when you need to know how many results exist beyond this page.
   */
  async getAllRaw(
    config?: AxiosRequestConfig
  ): Promise<DummyProductsResponse<T>> {
    try {
      const response = await axiosInstance.get<DummyProductsResponse<T>>(
        this.endpoint,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Fetches a single item by ID.
   * @param id - The ID of the item to fetch
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the item
   */
  async get(id: number | string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const encodedId = encodeURIComponent(id.toString());
      const response = await axiosInstance.get<T>(
        `${this.endpoint}/${encodedId}`,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Creates a new item.
   * @param data - The data to create
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the created item
   */
  async post(data: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(this.endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Updates an existing item.
   * @param id - The ID of the item to update
   * @param data - The updated data
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the updated item
   */
  async put(
    id: number | string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const encodedId = encodeURIComponent(id.toString());
      const response = await axiosInstance.put<T>(
        `${this.endpoint}/${encodedId}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Partially updates an existing item.
   * @param id - The ID of the item to update
   * @param data - The partial data to update
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the updated item
   */
  async patch(
    id: number | string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const encodedId = encodeURIComponent(id.toString());
      const response = await axiosInstance.patch<T>(
        `${this.endpoint}/${encodedId}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Deletes an item by ID.
   * @param id - The ID of the item to delete
   * @param config - Optional Axios request configuration
   * @returns Promise resolving when deletion is complete
   */
  async delete(
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    try {
      const encodedId = encodeURIComponent(id.toString());
      await axiosInstance.delete(`${this.endpoint}/${encodedId}`, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handles and logs API errors.
   * @param error - The error to handle
   * @private
   */
  private handleError(error: any): void {
    if (error instanceof APIError) {
      console.error(
        `API Error [${error.status}]: ${error.message}`,
        error.data
      );
    } else if (error instanceof CanceledError) {
      console.warn("Request was canceled:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// Export the axios instance for direct use if needed
export { axiosInstance };
export { CanceledError };
export default APIClient;
