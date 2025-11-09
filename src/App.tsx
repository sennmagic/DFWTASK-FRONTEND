import { useCallback, useMemo } from 'react'
import { ProductList } from './components/ProductList'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { SearchBar } from './components/SearchBar'
import { useIntersectionObserver } from './hooks/useIntersectionObserver'
import { useSearch } from './hooks/useSearch'

function App() {
  const {
    query,
    setQuery,
    debouncedQuery,
    items,
    total,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    reset,
    refetch,
  } = useSearch()
  
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return
    }
    void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const options = useMemo(
    () => ({
      rootMargin: '100px',
      disabled: !hasNextPage || isFetchingNextPage || Boolean(error),
    }),
    [error, hasNextPage, isFetchingNextPage],
  )

  const sentinelRef = useIntersectionObserver(handleLoadMore, options)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-16 sm:px-8 lg:px-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-200">
            <span className="size-2 rounded-full bg-emerald-400" />
            Real-time product search
          </div>
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            Find products in milliseconds
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
            Debounced search with smart caching keeps your experience fast and snappy. Start typing to
            discover products instantly.
          </p>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onReset={reset}
          placeholder="Search for phones, laptops, accessories..."
        />

        <section className="flex flex-col gap-6">
          {debouncedQuery && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                Showing <span className="font-semibold text-indigo-200">{items.length}</span> of{' '}
                <span className="font-semibold text-indigo-200">{total}</span> results for{' '}
                <span className="font-semibold text-indigo-200">&ldquo;{debouncedQuery}&rdquo;</span>
              </span>
              {isFetchingNextPage && <span className="animate-pulse">Fetching more...</span>}
            </div>
          )}

          <ProductList
            ref={sentinelRef}
            products={items}
            isLoading={isInitialLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            error={error}
            onRetry={() => void refetch()}
            query={query}
          />
        </section>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default App

