import type { Product, SearchRequest, SearchResponse } from '../types'
import type { PaginatedResponse } from './helpers/pagination'
import { toPaginatedResult } from './helpers/pagination'
import { getData } from './services/httpClient'

type RawProduct = Product & { name?: string }

interface NormalizeContext {
  page: number
  index: number
}

const normalizeProduct = (raw: RawProduct, context: NormalizeContext): Product => {
  const title = raw.title ?? raw.name ?? 'Untitled product'

  const resolvedId = (() => {
    const primaryId = raw.id ?? raw.name ?? raw.title

    if (primaryId !== undefined && primaryId !== null) {
      const candidate = String(primaryId).trim()
      if (candidate.length > 0) {
        return candidate
      }
    }

    return createFallbackProductId(raw, context)
  })()

  return {
    id: String(resolvedId),
    title,
    description: raw.description ?? '',
    image: raw.image,
    thumbnail: raw.thumbnail,
    price: typeof raw.price === 'number' ? raw.price : 0,
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    category: raw.category,
  }
}

function createFallbackProductId(raw: RawProduct, context: NormalizeContext): string {
  const hintValues = [
    raw.name,
    raw.title,
    raw.description,
    raw.category,
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  const hint = hintValues[0] ?? 'product'

  const normalizedHint = hint
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return ['fallback', context.page, context.index, normalizedHint].join('-')
}

export async function searchProducts({
  query,
  page = 1,
  pageSize,
  category,
  signal,
}: SearchRequest & { signal?: AbortSignal }): Promise<SearchResponse> {
  const raw = await getData<PaginatedResponse<RawProduct>, SearchQueryParams>('/products', {
    params: {
      search: query,
      page,
      limit: pageSize,
      category,
    },
    signal,
  })

  return toPaginatedResult(raw, normalizeProduct, { page, pageSize })
}

type SearchQueryParams = {
  search: string
  page: number
  limit?: number
  category?: string
}

