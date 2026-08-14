import { useCallback, useEffect, useState } from "react";
import { ApiError, getAssets } from "../services/api";
import type { AssetQuery, AssetResponse } from "../types/asset";

export type FetchState =
  | { status: "loading"; data: null }
  | { status: "success"; data: AssetResponse }
  | { status: "error"; error: ApiError; data: null };

export type UseAssetsResult = FetchState & { refetch: () => void };

export function useAssets(query: AssetQuery): UseAssetsResult {
  const [state, setState] = useState<FetchState>({
    status: "loading",
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getAssets(query, signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (error instanceof ApiError) {
          setState({ status: "error", error, data: null });
          return;
        }
        setState({
          status: "error",
          error: new ApiError("Unexpected error.", 0),
          data: null,
        });
      });

    return () => controller.abort();
  }, [query, refreshIndex]);

  return { ...state, refetch };
}
