# Testing Guide

This document describes the test suite for RS Sales App.

## Overview

- **Framework**: Vitest with jsdom environment
- **Total Tests**: 39 (36 unit + 3 integration)
- **Run Tests**: `yarn test`

## Test Structure

```
src/
├── services/
│   ├── db.test.ts          # IndexedDB operations
│   ├── cache.test.ts       # Cache API operations
│   ├── api.test.ts         # API fetch operations
│   └── sync.test.ts        # Sync engine logic
├── store/
│   └── store.test.ts       # Zustand state management
├── hooks/
│   ├── useOnlineStatus.test.ts
│   ├── useSync.test.ts
│   └── useContent.test.ts
└── test/
    ├── setup.ts            # Test environment setup
    └── integration/
        └── sync-flow.test.ts
```

## Unit Tests

### IndexedDB Layer (`db.test.ts`) - 9 tests

Tests for persistent storage of content metadata using IndexedDB via the `idb` library.

| Test | Description |
|------|-------------|
| `saveContentItems` / `getContentItems` | Store and retrieve content items |
| `getContentItemsByCategory` | Filter items by category ID |
| `saveCategories` / `getCategories` | Store and retrieve categories |
| `getSyncState` / `setSyncState` | Track sync metadata (lastSynced, version, count) |
| `clearDatabase` | Wipe all stored data |

**Mock**: Uses `fake-indexeddb` to simulate IndexedDB in jsdom.

### Cache Layer (`cache.test.ts`) - 4 tests

Tests for binary asset storage using the browser Cache API.

| Test | Description |
|------|-------------|
| `cacheAsset` | Store a blob with URL as key |
| `getCachedAsset` | Retrieve a cached blob by URL |
| `deleteAsset` | Remove a specific cached asset |
| `getCacheSize` | Calculate total size of cached assets |

**Mock**: Custom `vi.stubGlobal('caches', ...)` mock in setup.ts.

### API Layer (`api.test.ts`) - 3 tests

Tests for fetching the content manifest from WordPress.

| Test | Description |
|------|-------------|
| `fetchManifest` | Fetch and parse JSON manifest |
| Network failure | Throws on fetch rejection |
| Non-ok response | Throws on 404/500 responses |

**Mock**: `global.fetch` mocked per test.

### Sync Engine (`sync.test.ts`) - 7 tests

Tests for the core sync logic that orchestrates data flow.

| Test | Description |
|------|-------------|
| `compareManifests` - new items | Detects items in remote but not local |
| `compareManifests` - deleted items | Detects items in local but not remote |
| `compareManifests` - updated items | Detects items with different checksums |
| `compareManifests` - identical | Returns empty arrays when no changes |
| `buildDownloadQueue` | Combines toAdd and toUpdate items |
| `processDownloadQueue` | Downloads and caches each item with progress |
| `syncContent` | Full orchestration: fetch, compare, download, store |

### Zustand Store (`store.test.ts`) - 7 tests

Tests for application state management.

| Test | Description |
|------|-------------|
| `setItems` / `items` | Store and retrieve content items |
| `setCategories` / `categories` | Store and retrieve categories |
| `getFilteredItems` | Filter items by selected category |
| `getFilteredItems` (no filter) | Return all items when no category selected |
| `setSyncStatus` | Update sync status (idle, downloading, error) |
| `setSyncProgress` | Update progress (completed, total, currentItem) |
| `setLastSynced` | Update last sync timestamp |

### Hooks

#### `useOnlineStatus.test.ts` - 3 tests

| Test | Description |
|------|-------------|
| Returns true when online | Reads `navigator.onLine` |
| Returns false when offline | Handles offline state |
| Updates on status change | Responds to online/offline events |

#### `useSync.test.ts` - 2 tests

| Test | Description |
|------|-------------|
| Returns sync status | Reads from Zustand store |
| `sync()` calls syncContent | Triggers sync and updates store |

#### `useContent.test.ts` - 1 test

| Test | Description |
|------|-------------|
| Loads content on mount | Fetches from IndexedDB and populates store |

## Integration Tests

### Sync Flow (`sync-flow.test.ts`) - 3 tests

End-to-end tests that verify services work together correctly. Only `fetch` is mocked; IndexedDB and Cache use real implementations (via polyfills).

| Test | Description |
|------|-------------|
| Full sync flow | API fetch -> compare -> download -> store in IndexedDB + Cache |
| Offline retrieval | After sync, content accessible without network |
| Incremental sync | Second sync only downloads changed items |

## Test Setup

### `src/test/setup.ts`

Configures the test environment:

1. **Jest DOM matchers** - Enables `.toBeInTheDocument()`, etc.
2. **fake-indexeddb** - Polyfills IndexedDB for jsdom
3. **Cache API mock** - Stubs `caches.open()`, `cache.put()`, `cache.match()`, etc.

### `vitest.config.ts`

- Loads `.env` file for `VITE_API_URL`
- Sets jsdom environment
- Configures path aliases (`@/`)

## Running Tests

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test --watch

# Run specific file
yarn test src/services/sync.test.ts

# Run with coverage
yarn test --coverage
```

## Writing New Tests

Follow TDD (Test-Driven Development):

1. **Red** - Write a failing test
2. **Green** - Write minimum code to pass
3. **Refactor** - Clean up while keeping tests green

Tests are co-located with source files:
```
src/services/sync.ts
src/services/sync.test.ts
```

Integration tests live in `src/test/integration/`.
