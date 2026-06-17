import type { AxiosInstance } from 'axios';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';

export interface PingResponse {
  message: string;
  version: string;
}

export interface HealthResponse {
  status: string;
  database: string;
  deployment_marker?: string;
  environment?: string;
}

export class HealthUnavailableException extends Error {
  readonly response: HealthResponse;

  constructor(response: HealthResponse) {
    super(`Health unavailable: ${response.status}, database: ${response.database}`);
    this.name = 'HealthUnavailableException';
    this.response = response;
  }
}

export function createCoreApi(client: AxiosInstance) {
  return {
    async ping(): Promise<PingResponse> {
      const { data } = await client.get<PingResponse>(API.core.ping);
      return data;
    },

    async health(): Promise<HealthResponse> {
      const response = await client.get<HealthResponse>(API.core.health, {
        validateStatus: (status) => status === 200 || status === 503,
      });

      const body = response.data;
      if (response.status === 503) {
        throw new HealthUnavailableException(body);
      }

      return body;
    },
  };
}

export type CoreApi = ReturnType<typeof createCoreApi>;

export const coreApi = createCoreApi(apiClient);
