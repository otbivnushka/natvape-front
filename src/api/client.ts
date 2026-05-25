import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = '/api';

function getToken(): string | null {
  return useAuthStore.getState().token;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  let url = `${BASE_URL}${path}`;

  if (params) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') search.set(k, String(v));
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized');
  }
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>('GET', path, undefined, params),

  post: <T>(path: string, body?: unknown) =>
    request<T>('POST', path, body),

  patch: <T>(path: string, body?: unknown) =>
    request<T>('PATCH', path, body),

  delete: <T>(path: string) =>
    request<T>('DELETE', path),
};
