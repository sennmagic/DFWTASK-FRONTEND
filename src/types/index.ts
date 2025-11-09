export interface Product {
  id: string
  title: string
  description: string
  image?: string
  thumbnail?: string
  price: number
  rating?: number
  category?: string
}

export interface PaginatedResult<TItem> {
  items: TItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface SearchRequest {
  query: string
  page?: number
  pageSize?: number
  category?: string
}

export type SearchResponse = PaginatedResult<Product>
