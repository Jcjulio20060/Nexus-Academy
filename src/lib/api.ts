export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isForm = init?.body instanceof FormData;
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(body?.error ?? `Erro ${res.status}`, res.status);
  }
  return body as T;
}
