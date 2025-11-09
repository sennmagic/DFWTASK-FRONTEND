import type { PaginatedResult, Product, SearchRequest, SearchResponse } from '../types'
import { getJson } from './httpClient'

type RawProduct = Product & { name?: string }

interface RawPaginatedResponse<TRawItem> {
  query?: string
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  results?: TRawItem[]
}

interface NormalizeContext {
  page: number
  index: number
}

const normalizeProduct = (raw: RawProduct, context: NormalizeContext): Product => {
  const title = raw.title ?? raw.name ?? 'Untitled product'
  const primaryId = raw.id ?? raw.name ?? raw.title
  const resolvedId =
    typeof primaryId === 'string' && primaryId.trim().length > 0
      ? primaryId
      : `page-${context.page}-item-${context.index}`

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

export async function searchProducts({
  query,
  page = 1,
  pageSize,
  category,
  signal,
}: SearchRequest & { signal?: AbortSignal }): Promise<SearchResponse> {
  const raw = await getJson<RawPaginatedResponse<RawProduct>, SearchQueryParams>('/products', {
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

function toPaginatedResult<TRawItem, TItem>(
  raw: RawPaginatedResponse<TRawItem> | undefined,
  mapItem: (item: TRawItem, context: { index: number; page: number }) => TItem,
  fallback: { page: number; pageSize?: number },
): PaginatedResult<TItem> {
  const rawItems = Array.isArray(raw?.results) ? raw.results : []
  const page = coercePositiveInt(raw?.page, fallback.page)
  const items = rawItems.map((rawItem, index) => mapItem(rawItem, { index, page }))

  const pageSize = coercePositiveInt(raw?.limit, fallback.pageSize ?? rawItems.length)
  const total = coerceNonNegativeInt(raw?.total, items.length)

  const totalPages =
    pageSize > 0
      ? coerceNonNegativeInt(raw?.totalPages, Math.ceil(total / pageSize))
      : 0

  const hasMore =
    totalPages > 0 ? page < totalPages : pageSize > 0 && items.length === pageSize

  return { items, total, page, pageSize, hasMore }
}

function coercePositiveInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback
}

function coerceNonNegativeInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback
}
