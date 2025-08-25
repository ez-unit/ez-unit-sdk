import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { HyperUnitConfig, ApiResponse, HyperUnitError } from "./types";
import { BASE_URL } from "./constants";

/**
 * HTTP Client for HyperUnit API using Axios
 */
export class HyperUnitClient {
  private axiosInstance: AxiosInstance;

  constructor(config: HyperUnitConfig) {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL[config.environment || "mainnet"],
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  /**
   * Make a GET request to the HyperUnit API
   */
  async get<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url,
        params,
      };

      const response = await this.axiosInstance.request(config);

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: any) {
      if (error.response) {
        throw new HyperUnitError(
          error.response.data?.error || "API request failed",
          error.response.status,
          error.response.data?.code,
          error.response.data
        );
      } else if (error.request) {
        throw new HyperUnitError("Network error: No response received");
      } else {
        throw new HyperUnitError(`Request error: ${error.message}`);
      }
    }
  }
}
