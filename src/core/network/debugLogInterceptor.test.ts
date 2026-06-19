import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { attachDebugLogInterceptor, isSensitivePath } from '@/core/network/debugLogInterceptor';

describe('isSensitivePath', () => {
  it('marks auth paths as sensitive', () => {
    expect(isSensitivePath('/auth/login/')).toBe(true);
    expect(isSensitivePath('/auth/register/')).toBe(true);
    expect(isSensitivePath('/auth/token/refresh/')).toBe(true);
    expect(isSensitivePath('/ping/')).toBe(false);
  });
});

describe('attachDebugLogInterceptor', () => {
  it('logs method and path without request body on sensitive paths', async () => {
    const client = axios.create({ baseURL: 'https://example.com' });
    const messages: string[] = [];
    attachDebugLogInterceptor(client, (message) => messages.push(message));

    const mock = new MockAdapter(client);
    mock.onPost('/auth/login/').reply(200, { tokens: { access: 'a', refresh: 'r' } });

    await client.post('/auth/login/', { email: 'a@b.c', password: 'secret' });

    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain('POST');
    expect(messages[0]).toContain('/auth/login/');
    expect(messages[0]).toContain('body redacted');
    expect(messages.join(' ')).not.toContain('secret');
    expect(messages[1]).toContain('200');
  });

  it('logs status code on response', async () => {
    const client = axios.create({ baseURL: 'https://example.com' });
    const messages: string[] = [];
    attachDebugLogInterceptor(client, (message) => messages.push(message));

    const mock = new MockAdapter(client);
    mock.onGet('/ping/').reply(200, { message: 'pong' });

    await client.get('/ping/');

    expect(messages[1]).toContain('GET');
    expect(messages[1]).toContain('/ping/');
    expect(messages[1]).toContain('200');
    // Non-sensitive paths: body IS logged (messages[2] contains the JSON body)
    expect(messages[2]).toContain('pong');
  });
});
