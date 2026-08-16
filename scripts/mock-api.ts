import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import type { Asset } from '../src/types/asset';

const DEFAULT_PORT = 3001;
const LOCAL_HOST = '127.0.0.1';
const FRONTEND_ORIGIN = 'http://localhost:5173';
const ASSETS_PATH = resolve(process.cwd(), 'data/assets.json');
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function isAsset(value: unknown): value is Asset {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const asset = value as Record<string, unknown>;

  return (
    typeof asset.id === 'string' &&
    typeof asset.name === 'string' &&
    typeof asset.ticker === 'string' &&
    typeof asset.assetType === 'string' &&
    typeof asset.currency === 'string' &&
    typeof asset.quantity === 'number' &&
    Number.isFinite(asset.quantity) &&
    typeof asset.unitPrice === 'number' &&
    Number.isFinite(asset.unitPrice) &&
    typeof asset.marketValue === 'number' &&
    Number.isFinite(asset.marketValue) &&
    typeof asset.updatedAt === 'string'
  );
}

function loadAssets(): readonly Asset[] {
  const fileContents = readFileSync(ASSETS_PATH, 'utf8');
  const parsed: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsed) || !parsed.every(isAsset)) {
    throw new Error(`Asset dataset has an unexpected structure: ${ASSETS_PATH}`);
  }

  return parsed;
}

function getPort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('MOCK_API_PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function setCorsHeaders(response: ServerResponse, request?: IncomingMessage): void {
  const origin = request?.headers.origin;
  const isAllowedOrigin =
    origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  response.setHeader('Access-Control-Allow-Origin', isAllowedOrigin ? origin : FRONTEND_ORIGIN);
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Vary', 'Origin');
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
  request?: IncomingMessage,
): void {
  const payload = JSON.stringify(body);

  setCorsHeaders(response, request);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  response.end(payload);
}

function parsePaginationValue(value: string | null, fallback: number, maximum?: number): number {
  if (value === null) {
    return fallback;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error('Pagination values must be positive integers.');
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 1 || (maximum !== undefined && parsed > maximum)) {
    throw new Error('Pagination value is outside the allowed range.');
  }

  return parsed;
}

function filterAssetsBySearch(
  assets: readonly Asset[],
  search: string | null,
): readonly Asset[] {
  const normalizedSearch = search?.trim().toLowerCase() ?? '';

  if (normalizedSearch === '') {
    return assets;
  }

  return assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(normalizedSearch) ||
      asset.ticker.toLowerCase().includes(normalizedSearch),
  );
}

function filterAssets(
  assets: readonly Asset[],
  search: string | null,
  assetType: string | null,
  currency: string | null,
): readonly Asset[] {
  const normalizedAssetType = assetType?.trim().toLowerCase() ?? '';
  const normalizedCurrency = currency?.trim().toLowerCase() ?? '';

  return filterAssetsBySearch(assets, search).filter((asset) => {
    const matchesAssetType =
      normalizedAssetType === '' || asset.assetType.toLowerCase() === normalizedAssetType;
    const matchesCurrency =
      normalizedCurrency === '' || asset.currency.toLowerCase() === normalizedCurrency;

    return matchesAssetType && matchesCurrency;
  });
}

function handleAssetsRequest(
  requestUrl: URL,
  request: IncomingMessage,
  response: ServerResponse,
  assets: readonly Asset[],
): void {
  try {
    const page = parsePaginationValue(requestUrl.searchParams.get('page'), DEFAULT_PAGE);
    const limit = parsePaginationValue(
      requestUrl.searchParams.get('limit'),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );
    const filteredAssets = filterAssets(
      assets,
      requestUrl.searchParams.get('search'),
      requestUrl.searchParams.get('assetType'),
      requestUrl.searchParams.get('currency'),
    );
    const start = (page - 1) * limit;
    const total = filteredAssets.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const hasPreviousPage = page > 1 && page <= totalPages;
    const hasNextPage = page < totalPages;

    sendJson(
      response,
      200,
      {
        assets: filteredAssets.slice(start, start + limit),
        metadata: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
          nextPage: hasNextPage ? page + 1 : null,
        },
      },
      request,
    );
  } catch (error: unknown) {
    sendJson(
      response,
      400,
      {
        error: error instanceof Error ? error.message : 'Invalid pagination parameters.',
      },
      request,
    );
  }
}

function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  assets: readonly Asset[],
): void {
  if (request.method === 'OPTIONS') {
    setCorsHeaders(response, request);
    response.writeHead(204);
    response.end();
    return;
  }

  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    sendJson(response, 200, { status: 'ok', service: 'mock-api' }, request);
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/assets') {
    handleAssetsRequest(requestUrl, request, response, assets);
    return;
  }

  sendJson(response, 404, { error: 'Not found' }, request);
}

function main(): void {
  const port = getPort(process.env.MOCK_API_PORT);
  const assets = loadAssets();
  console.log(`[mock-api] loaded ${assets.length.toLocaleString()} assets into memory.`);
  const server = createServer((request, response) => handleRequest(request, response, assets));

  server.on('error', (error) => {
    console.error('[mock-api] server error:', error);
    process.exitCode = 1;
  });

  const shutdown = (signal: string): void => {
    console.log(`[mock-api] received ${signal}; shutting down.`);
    server.close((error) => {
      if (error) {
        console.error('[mock-api] shutdown error:', error);
        process.exitCode = 1;
      }
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  server.listen(port, LOCAL_HOST, () => {
    console.log(`[mock-api] listening on http://${LOCAL_HOST}:${port}`);
  });
}

try {
  main();
} catch (error: unknown) {
  console.error('[mock-api] startup error:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
