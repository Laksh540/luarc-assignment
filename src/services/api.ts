import type { AssetQuery, AssetResponse } from '../types/asset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as { error?: string };
      if (typeof body.error === 'string' && body.error !== '') {
        message = body.error;
      }
    } catch {
      // Ignore bodies that are not JSON.
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function fetchAssetsPage(
  query: Omit<AssetQuery, "page">,
  page: number,
  signal?: AbortSignal,
): Promise<AssetResponse> {
  return getAssets({ ...query, page }, signal);
}

export function getAssets(query: AssetQuery, signal?: AbortSignal): Promise<AssetResponse> {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) {
    params.set('search', query.search);
  }
  if (query.assetType) {
    params.set('assetType', query.assetType);
  }
  if (query.currency) {
    params.set('currency', query.currency);
  }

  return request<AssetResponse>(`/assets?${params.toString()}`, signal);
}
