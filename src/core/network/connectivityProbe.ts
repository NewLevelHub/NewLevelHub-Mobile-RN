import type { AxiosError } from 'axios';

import { coreApi, type CoreApi, type HealthResponse, HealthUnavailableException, type PingResponse } from '@/core/network/coreApi';

export type ConnectivityProbeOk = {
  kind: 'ok';
  ping: PingResponse;
  health: HealthResponse;
};

export type ConnectivityProbeHealthUnavailable = {
  kind: 'health_unavailable';
  ping: PingResponse;
  health: HealthResponse;
};

export type ConnectivityProbePingFailed = {
  kind: 'ping_failed';
  error: unknown;
};

export type ConnectivityProbeResult =
  | ConnectivityProbeOk
  | ConnectivityProbeHealthUnavailable
  | ConnectivityProbePingFailed;

export class ConnectivityProbe {
  private readonly api: CoreApi;

  constructor(api: CoreApi = coreApi) {
    this.api = api;
  }

  async run(): Promise<ConnectivityProbeResult> {
    try {
      const ping = await this.api.ping();

      try {
        const health = await this.api.health();
        return { kind: 'ok', ping, health };
      } catch (error) {
        if (error instanceof HealthUnavailableException) {
          return {
            kind: 'health_unavailable',
            ping,
            health: error.response,
          };
        }
        throw error;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        return { kind: 'ping_failed', error };
      }
      return { kind: 'ping_failed', error };
    }
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error != null && 'isAxiosError' in error;
}
