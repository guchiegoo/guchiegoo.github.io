import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCatalog } from '../src/catalog/useCatalog'
import { okResponse, sampleCatalog } from './fixtures'

describe('useCatalog', () => {
  it('starts loading, then is ready with a parsed catalog', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse(sampleCatalog())))
    const { result } = renderHook(() => useCatalog())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.catalog?.styles).toHaveLength(6)
  })

  it('fetches /catalog.json with no-store caching', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(sampleCatalog()))
    vi.stubGlobal('fetch', fetchMock)
    const { result } = renderHook(() => useCatalog())
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(fetchMock).toHaveBeenCalledWith('/catalog.json', { cache: 'no-store' })
  })

  it('is an error when the fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const { result } = renderHook(() => useCatalog())
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.catalog).toBeUndefined()
  })

  it('is an error when the JSON is invalid', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse({ nope: true })))
    const { result } = renderHook(() => useCatalog())
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('is an error on a non-OK response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }))
    const { result } = renderHook(() => useCatalog())
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
})
