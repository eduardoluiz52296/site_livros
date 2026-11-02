export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}
export const getToken = (): string | null => { try { return localStorage.getItem('token'); } catch { return null; } };

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch { throw new ApiError('Não foi possível conectar ao servidor. Tente novamente em instantes.', 0); }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message ?? 'Algo deu errado. Tente novamente.', res.status);
  return data as T;
}
