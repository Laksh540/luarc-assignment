export type Asset = {
  id: string;
  name: string;
  ticker: string;
  assetType: string;
  currency: string;
  quantity: number;
  unitPrice: number;
  marketValue: number;
  updatedAt: string;
};

export type AssetMetadata = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
};

export type AssetResponse = {
  assets: Asset[];
  metadata: AssetMetadata;
};

export type AssetQuery = {
  page: number;
  limit: number;
  search?: string;
  assetType?: string;
  currency?: string;
};
