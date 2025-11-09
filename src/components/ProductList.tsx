import { forwardRef, memo } from 'react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  error: Error | null
  onRetry: () => void
  query: string
}

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"
      >
        <div className="h-40 rounded-t-2xl bg-slate-800/60" />
        <div className="space-y-3 p-4">
          <div className="h-4 w-3/4 rounded bg-slate-800/70" />
          <div className="h-3 w-full rounded bg-slate-800/70" />
          <div className="h-3 w-2/3 rounded bg-slate-800/70" />
        </div>
      </div>
    ))}
  </>
)

const MessageCard = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
    <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{description}</p>
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
)

export const ProductList = memo(
  forwardRef<HTMLDivElement, ProductListProps>(
    (
      {
        products = [],
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        error,
        onRetry,
        query,
      },
      sentinelRef,
    ) => {
      const trimmedQuery = query.trim()


      if (error) {
        return (
          <MessageCard
            title="Something went wrong"
            description={error.message || 'We could not load the products right now.'}
            action={
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-indigo-50 transition hover:bg-indigo-400"
                >
                  Try again
                </button>
                {trimmedQuery && (
                  <span className="text-xs text-slate-500">
                    Search term: “{trimmedQuery}”
                  </span>
                )}
              </div>
            }
          />
        )
      }

    
      if (!isLoading && !products.length && trimmedQuery) {
        return (
          <MessageCard
            title="No results found"
            description="Try adjusting your search terms or check your spelling."
          />
        )
      }

  
      if (!isLoading && !products.length && !trimmedQuery) {
        return (
          <MessageCard
            title="Start exploring"
            description="Search for products to see real-time results from the catalog."
          />
        )
      }

      return (
        <div className="flex flex-col gap-8">
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading && !products.length ? (
              <LoadingSkeleton />
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </section>

          {(isFetchingNextPage || hasNextPage) && (
            <div className="flex flex-col items-center gap-3">
              <div
                ref={sentinelRef}
                className="h-2 w-full max-w-lg rounded-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-60"
                aria-hidden
              />
              <p className="text-sm text-slate-400">
                {isFetchingNextPage
                  ? 'Loading more products...'
                  : 'Scroll to load more'}
              </p>
            </div>
          )}
        </div>
      )
    },
  ),
)

ProductList.displayName = 'ProductList'
