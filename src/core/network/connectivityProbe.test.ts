import axios from 'axios';

import {
  createCoreApi,
  HealthUnavailableException,
  type HealthResponse,
  type PingResponse,
} from '@/core/network/coreApi';
import { ConnectivityProbe } from '@/core/network/connectivityProbe';

function createFakeCoreApi(handlers: {
  onPing: () => Promise<PingResponse>;
  onHealth: () => Promise<HealthResponse>;
}) {
  return {
    ping: handlers.onPing,
    health: handlers.onHealth,
  };
}

describe('ConnectivityProbe', () => {
  it('returns ok when ping and health succeed', async () => {
    const ping: PingResponse = { message: 'pong', version: '1' };
    const health: HealthResponse = { status: 'healthy', database: 'connected' };

    const probe = new ConnectivityProbe(
      createFakeCoreApi({
        onPing: async () => ping,
        onHealth: async () => health,
      }),
    );

    const result = await probe.run();
    expect(result.kind).toBe('ok');
    if (result.kind === 'ok') {
      expect(result.ping).toEqual(ping);
      expect(result.health).toEqual(health);
    }
  });

  it('returns health unavailable on 503', async () => {
    const ping: PingResponse = { message: 'pong', version: '1' };
    const unhealthy: HealthResponse = { status: 'unhealthy', database: 'unavailable' };

    const probe = new ConnectivityProbe(
      createFakeCoreApi({
        onPing: async () => ping,
        onHealth: async () => {
          throw new HealthUnavailableException(unhealthy);
        },
      }),
    );

    const result = await probe.run();
    expect(result.kind).toBe('health_unavailable');
    if (result.kind === 'health_unavailable') {
      expect(result.ping).toEqual(ping);
      expect(result.health).toEqual(unhealthy);
    }
  });

  it('returns ping failed on network error', async () => {
    const probe = new ConnectivityProbe(
      createFakeCoreApi({
        onPing: async () => {
          throw new axios.AxiosError('timeout', 'ECONNABORTED');
        },
        onHealth: async () => ({ status: 'healthy', database: 'connected' }),
      }),
    );

    const result = await probe.run();
    expect(result.kind).toBe('ping_failed');
  });
});

describe('createCoreApi health', () => {
  it('throws HealthUnavailableException on 503', async () => {
    const client = axios.create({ baseURL: 'https://example.com' });
    const api = createCoreApi(client);

    const mock = jest.spyOn(client, 'get').mockResolvedValue({
      status: 503,
      statusText: 'Service Unavailable',
      headers: {},
      config: { headers: {} },
      data: { status: 'unhealthy', database: 'unavailable' },
    });

    await expect(api.health()).rejects.toBeInstanceOf(HealthUnavailableException);

    mock.mockRestore();
  });
});
