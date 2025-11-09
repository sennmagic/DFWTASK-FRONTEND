
import { Product } from "../types"
interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-md shadow-slate-950/30 transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-900/50">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        {product.image || product.thumbnail ? (
          <img
            src={product.image ?? product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-slate-100">{product.title}</h3>
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-indigo-300/80">{product.category}</p>
          )}
        </header>
        <p className="line-clamp-3 text-sm text-slate-400">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm font-medium">
          <span className="text-xl font-bold text-indigo-300">
            {Number.isFinite(product.price) ? `$${product.price.toFixed(2)}` : 'Contact'}
          </span>
          {product.rating !== undefined && (
            <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-amber-300">
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 17.3 5.82 21l1.58-6.77L2 9.24l6.91-.59L12 2l3.09 6.65 6.91.59-5.4 4.99L18.18 21z" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

