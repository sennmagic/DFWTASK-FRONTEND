import axios from 'axios'

type Primitive = string | number | boolean
type QueryValue = Primitive | '' | null | undefined | Array<Primitive | '' | null | undefined>

export type QueryParams<T extends Record<string, QueryValue>> = T

const baseURL = (() => {
  const fromImportMeta = (() => {
    try {
      return import.meta.env?.VITE_API_BASE_URL
    } catch {
      return undefined
    }
  })()

  const fromProcess =
    typeof process !== 'undefined' && process.env ? process.env.VITE_API_BASE_URL : undefined

  const candidate = [fromImportMeta, fromProcess].find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )

  if (candidate) {
    return candidate.replace(/\/+$/, '')
  }

  return '/api'
})()

export const httpClient = axios.create({
  baseURL,
  timeout: 10_000,
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== undefined && item !== null && item !== '') {
              searchParams.append(key, String(item))
            }
          })
          return
        }

        searchParams.set(key, String(value))
      })

      return searchParams.toString()
    },
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      return Promise.reject(
        Object.assign(new Error(data?.message ?? 'Request failed'), {
          status,
          details: data,
        }),
      )
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out'))
    }

    return Promise.reject(error)
  },
)

export function pruneQueryParams<T extends Record<string, QueryValue>>(params: T): Partial<T> {
  const sanitizedEntries = Object.entries(params).flatMap(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return []
    }

    if (Array.isArray(value)) {
      const filtered = value.filter((item) => item !== undefined && item !== null && item !== '')
      if (!filtered.length) {
        return []
      }
      return [[key, filtered]]
    }

    return [[key, value]]
  })

  return Object.fromEntries(sanitizedEntries) as Partial<T>
}

interface GetJsonOptions<TParams extends Record<string, QueryValue>> {
  params?: TParams
  signal?: AbortSignal
}

export async function getJson<TResponse, TParams extends Record<string, QueryValue>>(
  url: string,
  options: GetJsonOptions<TParams> = {},
): Promise<TResponse> {
  const { params, signal } = options

  const response = await httpClient.get<TResponse>(url, {
    params: params ? pruneQueryParams(params) : undefined,
    signal,
  })

  return response.data
}

