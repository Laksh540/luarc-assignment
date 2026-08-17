import {
  useWindowVirtualizer,
  type VirtualItem,
  type ReactVirtualizer,
} from "@tanstack/react-virtual";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { Asset } from "../types/asset";

const DEFAULT_ROW_HEIGHT = 45;

type UseAssetVirtualizerOptions = {
  rows: Asset[];
  estimateSize?: number;
  overscan?: number;
  gap?: number;
};

export type UseAssetVirtualizerResult = {
  virtualizer: ReactVirtualizer<Window, HTMLTableRowElement>;
  virtualItems: VirtualItem[];
  getTotalSize: () => number;
  scrollMargin: number;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function useAssetVirtualizer({
  rows,
  estimateSize = DEFAULT_ROW_HEIGHT,
  overscan = 8,
  gap = 0,
}: UseAssetVirtualizerOptions): UseAssetVirtualizerResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const measureScrollMargin = () => {
      const element = containerRef.current;
      if (element) {
        setScrollMargin(element.getBoundingClientRect().top + window.scrollY);
      }
    };

    measureScrollMargin();
    window.addEventListener("resize", measureScrollMargin);

    return () => window.removeEventListener("resize", measureScrollMargin);
  }, []);

  const virtualizer = useWindowVirtualizer<HTMLTableRowElement>({
    count: rows.length,
    getItemKey: (index) => rows[index]?.id ?? index,
    estimateSize: () => estimateSize,
    overscan,
    gap,
    scrollMargin,
  });

  return {
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    getTotalSize: () => virtualizer.getTotalSize(),
    scrollMargin,
    containerRef,
  };
}
