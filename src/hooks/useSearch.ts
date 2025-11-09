import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { searchProducts } from '../api/productApi'
import type { Product, SearchResponse } from '../types'

export const DEBOUNCE_DELAY = 400
const DEFAULT_PAGE_SIZE = 10

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(handle)
  }, [value, delay])

  return debouncedValue
}

export interface UseSearchResult {
  query: string
  setQuery: (value: string) => void
  items: Product[]
  total: number
  isInitialLoading: boolean
  isFetchingNextPage: boolean
  error: Error | null
  hasNextPage: boolean
  fetchNextPage: () => Promise<unknown>
  refetch: () => Promise<unknown>
  reset: () => void
  debouncedQuery: string
}

export function useSearch(initialQuery = ''): UseSearchResult {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_DELAY)

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery<SearchResponse, Error>({
      queryKey: ['search', debouncedQuery],
      queryFn: ({ pageParam = 1, signal }) =>
        searchProducts({
          query: debouncedQuery,
          page: typeof pageParam === 'number' ? pageParam : 1,
          pageSize: DEFAULT_PAGE_SIZE,
          signal,
        }),
      enabled: Boolean(debouncedQuery.trim()),
      initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return undefined
      return (lastPage.page || 1) + 1
    },
    staleTime: 60_000,
    gcTime: 300_000,
  })

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      void refetch({ cancelRefetch: true })
    }
  }, [debouncedQuery, refetch])

  const aggregated = useMemo(() => {
    const pages = data?.pages ?? []
    const items = pages.flatMap((page) => page.items ?? [])
    const firstPage = pages.length > 0 ? pages[0] : undefined
    const total = firstPage && typeof firstPage.total === 'number' ? firstPage.total : 0

    return { items, total }
  }, [data])

  return {
    query,
    setQuery,
    
    items: aggregated.items,
    total: aggregated.total,
    isInitialLoading: isLoading,
    isFetchingNextPage,
    error: error ?? null,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage: () => fetchNextPage(),
    refetch: () => refetch(),
    reset: () => {
      setQuery('')
      void refetch({ cancelRefetch: true })
    },
    debouncedQuery,
  }
}

