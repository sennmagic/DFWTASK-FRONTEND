const mockGetData = jest.fn()

jest.mock('../services/httpClient', () => ({
  getData: mockGetData,
}))

import { searchProducts } from '../productApi'

describe('searchProducts', () => {
  beforeEach(() => {
    mockGetData.mockReset()
  })

  it('requests the products endpoint with pagination parameters and normalizes the response', async () => {
    mockGetData.mockResolvedValueOnce({
      query: 'iphone',
      page: 2,
      limit: 10,
      total: 40,
      totalPages: 4,
      results: [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          description: 'Latest flagship',
          price: 1500,
          category: 'mobile',
        },
      ],
    })

    const result = await searchProducts({
      query: 'iphone',
      page: 2,
      pageSize: 10,
    })

    expect(mockGetData).toHaveBeenCalledWith('/products', {
      params: {
        search: 'iphone',
        page: 2,
        limit: 10,
      },
      signal: undefined,
    })

    expect(result).toEqual({
      items: [
        {
          id: '1',
          title: 'iPhone 15 Pro',
          description: 'Latest flagship',
          image: undefined,
      
          price: 1500,
          rating: undefined,
          category: 'mobile',
        },
      ],
      total: 40,
      page: 2,
      pageSize: 10,
      hasMore: true,
    })
  })

  it('falls back to sensible defaults when optional fields are missing', async () => {
    mockGetData.mockResolvedValueOnce({})

    const result = await searchProducts({
      query: '',
      page: 1,
      pageSize: 10,
    })

    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    })
  })
})

