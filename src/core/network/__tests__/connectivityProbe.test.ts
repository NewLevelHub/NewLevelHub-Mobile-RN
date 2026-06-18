import { ConnectivityProbe } from '@/core/network/connectivityProbe';
import { HealthUnavailableException } from '@/core/network/coreApi';
import type { CoreApi, PingResponse, HealthResponse } from '@/core/network/coreApi';

const mockPingOk: PingResponse = { message: 'pong', version: 'beta-test' };
const mockHealthOk: HealthResponse = { status: 'healthy', database: 'connected' };
const mockHealthUnhealthy: HealthResponse = { status: 'unhealthy', database: 'unavailable' };

function makeApi(overrides: Partial<CoreApi>): CoreApi {
  return {
    ping: jest.fn<Promise<PingResponse>, []>().mockResolvedValue(mockPingOk),
    health: jest.fn<Promise<HealthResponse>, []>().mockResolvedValue(mockHealthOk),
    ...overrides,
  };
}

describe('ConnectivityProbe.run()', () => {
  it('returns ok when ping succeeds and health returns healthy', async () => {
    const api = makeApi({});
    const probe = new ConnectivityProbe(api);

    const result = await probe.run();

    expect(result.kind).toBe('ok');
    if (result.kind === 'ok') {
      expect(result.ping).toEqual(mockPingOk);
      expect(result.health).toEqual(mockHealthOk);
    }
  });

  it('returns health_unavailable when ping succeeds but health throws HealthUnavailableException', async () => {
    const api = makeApi({
      health: jest.fn<Promise<HealthResponse>, []>().mockRejectedValue(
        new HealthUnavailableException(mockHealthUnhealthy),
      ),
    });
    const probe = new ConnectivityProbe(api);

    const result = await probe.run();

    expect(result.kind).toBe('health_unavailable');
    if (result.kind === 'health_unavailable') {
      expect(result.ping).toEqual(mockPingOk);
      expect(result.health).toEqual(mockHealthUnhealthy);
    }
  });

  it('returns ping_failed when ping throws a network error', async () => {
    const networkError = Object.assign(new Error('Network Error'), { isAxiosError: true });
    const api = makeApi({
      ping: jest.fn<Promise<PingResponse>, []>().mockRejectedValue(networkError),
    });
    const probe = new ConnectivityProbe(api);

    const result = await probe.run();

    expect(result.kind).toBe('ping_failed');
    if (result.kind === 'ping_failed') {
      expect(result.error).toBe(networkError);
    }
  });
});
