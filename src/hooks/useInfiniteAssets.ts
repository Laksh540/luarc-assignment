import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, fetchAssetsPage } from "../services/api";
import type { Asset, AssetMetadata, AssetQuery } from "../types/asset";

export type AssetQueryWithoutPage = Omit<AssetQuery, "page">;

type InfiniteState =
  | {
      status: "loading";
      loadedKey: string;
      assets: [];
      metadata: null;
      error: null;
    }
  | {
      status: "success";
      loadedKey: string;
      assets: Asset[];
      metadata: AssetMetadata;
      error: null;
    }
  | {
      status: "error";
      loadedKey: string;
      assets: [];
      metadata: null;
      error: ApiError;
    };

export type UseInfiniteAssetsResult = {
  assets: Asset[];
  metadata: AssetMetadata | null;
  status: "loading" | "success" | "error";
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: ApiError | null;
  loadMore: () => void;
  refetch: () => void;
};

export function useInfiniteAssets(
  query: AssetQueryWithoutPage,
): UseInfiniteAssetsResult {
  const [state, setState] = useState<InfiniteState>({
    status: "loading",
    loadedKey: "",
    assets: [],
    metadata: null,
    error: null,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const loadingMoreRef = useRef(false);

  const loadedKey = useMemo(
    () => `${refreshIndex}:${JSON.stringify(query)}`,
    [refreshIndex, query],
  );

  const refetch = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchAssetsPage(query, 1, signal)
      .then((data) =>
        setState({
          status: "success",
          loadedKey,
          assets: data.assets,
          metadata: data.metadata,
          error: null,
        }),
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (error instanceof ApiError) {
          setState({
            status: "error",
            loadedKey,
            assets: [],
            metadata: null,
            error,
          });
          return;
        }
        setState({
          status: "error",
          loadedKey,
          assets: [],
          metadata: null,
          error: new ApiError("Unexpected error.", 0),
        });
      });

    return () => controller.abort();
  }, [query, loadedKey]);

  const isInitialLoading = state.status === "loading" || state.loadedKey !== loadedKey;

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current) {
      return;
    }
    if (state.status !== "success" || state.loadedKey !== loadedKey) {
      return;
    }
    if (!state.metadata.hasNextPage) {
      return;
    }
    const nextPage = state.metadata.nextPage;
    if (nextPage == null) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    const controller = new AbortController();
    const { signal } = controller;

    fetchAssetsPage(query, nextPage, signal)
      .then((data) => {
        setState((prev) => {
          if (prev.status !== "success" || prev.loadedKey !== loadedKey) {
            return prev;
          }
          const seen = new Set(prev.assets.map((asset) => asset.id));
          const newAssets = data.assets.filter((asset) => !seen.has(asset.id));
          return {
            ...prev,
            assets: [...prev.assets, ...newAssets],
            metadata: data.metadata,
          };
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      })
      .finally(() => {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      });
  }, [query, loadedKey, state]);

  return {
    assets: state.assets,
    metadata: state.metadata,
    status: state.status,
    isInitialLoading,
    isLoadingMore,
    error: state.error,
    loadMore,
    refetch,
  };
}
