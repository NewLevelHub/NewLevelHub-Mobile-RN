import { ConnectivityProbe } from '@/core/network/connectivityProbe';

export type BootstrapConnectivityStatus = 'ok' | 'health_unavailable' | 'ping_failed';

/**
 * Runs a connectivity pre-flight before the auth bootstrap.
 * Returns one of three statuses that the caller uses to decide whether
 * to proceed with /auth/me/ or show an error screen.
 */
export async function runConnectivityPreFlight(): Promise<BootstrapConnectivityStatus> {
  const result = await new ConnectivityProbe().run();
  return result.kind;
}
