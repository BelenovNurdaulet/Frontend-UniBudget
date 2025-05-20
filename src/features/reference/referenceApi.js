import { apiSlice } from '../../app/api/apiSlice'

const CACHE_KEY = 'referenceCache'
const CACHE_TIME_KEY = 'referenceCacheTime'
const ONE_DAY = 24 * 60 * 60 * 1000

export const referenceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReference: builder.query({

            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const now = Date.now()
                    const cached = localStorage.getItem(CACHE_KEY)
                    const cachedTime = parseInt(localStorage.getItem(CACHE_TIME_KEY) || '0', 10)


                    if (cached && now - cachedTime < ONE_DAY) {
                        const wrapper = JSON.parse(cached)
                        return { data: wrapper }
                    }


                    const result = await fetchWithBQ('/api/references')
                    if (result.error) {
                        return { error: result.error }
                    }


                    localStorage.setItem(CACHE_KEY, JSON.stringify(result.data))
                    localStorage.setItem(CACHE_TIME_KEY, now.toString())

                    return { data: result.data }
                } catch (err) {

                    return { error: err }
                }
            },

            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
})

export const { useGetReferenceQuery } = referenceApi
