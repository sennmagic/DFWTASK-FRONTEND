import type { PaginatedResult } from '../../types'

export interface PaginatedResponse<TRawItem> {
  results?: TRawItem[] | null
  page?: number | null
  limit?: number | null
  total?: number | null
  totalPages?: number | null
}

interface MapContext {
  index: number
  page: number
}

interface FallbackValues {
  page: number
  pageSize?: number
}

export function toPaginatedResult<TRawItem, TItem>(
  raw: PaginatedResponse<TRawItem> | undefined,
  mapItem: (item: TRawItem, context: MapContext) => TItem,
  fallback: FallbackValues,
): PaginatedResult<TItem> {
  const rawItems = Array.isArray(raw?.results) ? raw.results : []
  const page = coercePositiveInt(raw?.page ?? undefined, fallback.page)
  const items = rawItems.map((rawItem, index) => mapItem(rawItem, { index, page }))

  const pageSize = coercePositiveInt(raw?.limit ?? undefined, fallback.pageSize ?? rawItems.length)
  const total = coerceNonNegativeInt(raw?.total ?? undefined, items.length)

  const totalPages =
    pageSize > 0
      ? coerceNonNegativeInt(raw?.totalPages ?? undefined, Math.ceil(total / pageSize))
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

