import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { faker } from '@faker-js/faker';
import type { Asset } from '../src/types/asset';

const DEFAULT_COUNT = 50_000;
const SEED = 20260814;
const ASSET_TYPES = ['Equity', 'Bond', 'ETF', 'Mutual Fund', 'Commodity'];

function parseCount(value: string | undefined): number {
  if (value === undefined) {
    return DEFAULT_COUNT;
  }

  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new Error('Asset count must be a positive safe integer.');
  }

  return count;
}

function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function createAsset(): Asset {
  const quantity = faker.number.float({ min: 1, max: 10_000, fractionDigits: 4 });
  const unitPrice = faker.number.float({ min: 1, max: 10_000, fractionDigits: 2 });

  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    ticker: faker.string.alpha({ length: { min: 3, max: 5 }, casing: 'upper' }),
    assetType: faker.helpers.arrayElement(ASSET_TYPES),
    currency: faker.finance.currencyCode(),
    quantity,
    unitPrice,
    marketValue: roundToTwo(quantity * unitPrice),
    updatedAt: faker.date.recent({ days: 365 }).toISOString(),
  };
}

async function main(): Promise<void> {
  const count = parseCount(process.argv[2]);
  const outputDirectory = resolve(process.cwd(), 'data');
  const outputPath = resolve(outputDirectory, 'assets.json');

  try {
    await access(outputPath);
    console.log(`Skipped asset generation because ${outputPath} already exists.`);
    return;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  faker.seed(SEED);
  const assets = Array.from({ length: count }, createAsset);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(assets, null, 2)}\n`, 'utf8');
  console.log(`Generated ${count.toLocaleString()} assets at ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
