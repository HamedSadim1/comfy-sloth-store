import axios, { AxiosInstance, AxiosRequestConfig, CanceledError } from "axios";

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
 * Axios instance configured for the application.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://course-api.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
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
   * Fetches all items from the endpoint.
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to array of items
   */
  async getAll(config?: AxiosRequestConfig): Promise<T[]> {
    try {
      const response = await axiosInstance.get<T[]>(this.endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw after logging
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
