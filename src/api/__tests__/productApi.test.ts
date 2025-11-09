const mockGet = jest.fn()
const mockUse = jest.fn()

jest.mock('axios', () => {
  const actual = jest.requireActual('axios')

  actual.create = jest.fn(() => ({
    get: mockGet,
    interceptors: {
      response: {
        use: mockUse,
      },
    },
  }))

  return actual
})

import { searchProducts } from '../productApi'

describe('searchProducts', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockUse.mockReset()
  })

  it('requests the products endpoint with pagination parameters and normalizes the response', async () => {
    const apiResponse = {
      data: {
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
      },
    }

    mockGet.mockResolvedValueOnce(apiResponse)

    const result = await searchProducts({
      query: 'iphone',
      page: 2,
      pageSize: 10,
    })

    expect(mockGet).toHaveBeenCalledWith('/products', {
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
          thumbnail: undefined,
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
    mockGet.mockResolvedValueOnce({
      data: {},
    })

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

