# Task 36 — Dataset Scalability Results

Tested on 17 August 2026 using the deterministic generator and the local mock
API. The baseline `data/assets.json` was restored to 50,000 records after the
tests.

## Dataset generation

| Records | Generated file | Generation time |
| ---: | ---: | ---: |
| 100,000 | 29.5 MB | 1.172 s |
| 250,000 | 73.7 MB | 2.450 s |
| 500,000 | 147.4 MB | 4.490 s |
| 1,000,000 | 294.7 MB | 8.425 s |

All generated datasets contained the requested number of valid records.

## API results

Each dataset loaded successfully and returned HTTP 200 for first-page,
deep-page, search, filter, and combined search/filter requests.

| Records | API RSS at startup | First page | Deep page | Search | Filter | Combined |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100,000 | 3.4 MB | 3.6 ms | 2.3 ms | 9.9 ms | 6.3 ms | 7.7 ms |
| 250,000 | 4.3 MB | 3.9 ms | 2.2 ms | 10.4 ms | 5.2 ms | 7.7 ms |
| 500,000 | 6.2 MB | 3.1 ms | 3.4 ms | 9.5 ms | 6.0 ms | 16.8 ms |
| 1,000,000 | 22.4 MB | 4.3 ms | 12.0 ms | 7.6 ms | 13.0 ms | 7.4 ms |

The API continued to serve bounded pages (`limit=50`) and computed metadata
after filtering. No endpoint attempted to return the full dataset.

## Frontend scalability checks

The existing frontend implementation uses `useInfiniteAssets` to request page
1 and subsequent `nextPage` values, while `useAssetVirtualizer` renders only
the current virtual window plus overscan. This preserves incremental loading
and bounded DOM rendering as the loaded asset array grows.

An interactive browser run should still be repeated during final QA for visual
scroll responsiveness at the largest dataset; this repository-level run
verified the data/API path and the existing virtualization configuration.

## Validation

- `npm run lint` passed with one existing `react-hooks/incompatible-library`
  warning for TanStack Table.
- `npm run typecheck` passed.
- `npm run build` passed.
- `data/assets.json` was restored and verified at 50,000 records.

## Conclusion

The mock architecture remained usable through 1M generated records in this
environment. The practical limitation is the single large JSON file loaded
into API memory; production-scale data should use persistent storage with
indexed server-side search/filtering and cursor- or offset-based pagination.
