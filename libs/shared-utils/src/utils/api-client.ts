import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';

type ApiClientConfig = {
  baseUrl: string;
  accessTokenName: string;
  refreshTokenName: string;
  refreshTokenUrl: string;
};

interface ApiClientRequestOptions extends AxiosRequestConfig {
  withAuthentication?: boolean;
}

class ApiClient {
  protected readonly axios: AxiosInstance;
  protected readonly accessTokenName: string;
  protected readonly refreshTokenName: string;
  protected readonly refreshTokenUrl: string;
  private isRefreshing: boolean;
  private refreshQueue: AxiosRequestConfig[];

  constructor(config: ApiClientConfig) {
    this.axios = axios.create({ baseURL: config.baseUrl });
    this.accessTokenName = config.accessTokenName;
    this.refreshTokenName = config.refreshTokenName;
    this.refreshTokenUrl = config.refreshTokenUrl;
    this.isRefreshing = false;
    this.refreshQueue = [];
  }

  async request<T>(options: ApiClientRequestOptions) {
    const { withAuthentication = false, ...axiosRequestOptions } = options;

    try {
      if (withAuthentication) {
        this.withRefreshToken();
      }

      const response = await this.axios.request(axiosRequestOptions);

      return response.data as T;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected withRefreshToken() {
    this.axios.interceptors.request.use(
      async (config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem(this.accessTokenName)}`;

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      async (response) => response,
      async (error) => {
        const originalRequest: AxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401) {
          if (!this.isRefreshing) {
            try {
              this.isRefreshing = true;

              const response: AxiosResponse = await axios.get(this.refreshTokenUrl, {
                withCredentials: true,
              });

              const accessToken = response.data[this.accessTokenName];

              localStorage.setItem(this.accessTokenName, accessToken);
              error.config.headers['Authorization'] = `Bearer ${accessToken}`;

              for await (const request of this.refreshQueue) {
                this.axios(request);
              }

              this.refreshQueue = [];

              return await this.axios(originalRequest);
            } catch (error) {
              localStorage.setItem(this.accessTokenName, '');

              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = '';
              }

              return Promise.reject(error);
            } finally {
              this.isRefreshing = false;
            }
          }

          this.refreshQueue.push(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    return this;
  }
}

export { ApiClient, type ApiClientConfig, type ApiClientRequestOptions };
