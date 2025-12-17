interface MovieIdeaResponse {
  title: string
  poster: string | null
  locale: 'vo' | 'vf'
  letterboxdUrl: string
  year: string
}

interface TmdbPage {
  results?: Array<{
    id?: number
    title?: string
    poster_path?: string
    release_date?: string
  }>
  total_pages?: number
}

interface TmdbMovieDetails {
  imdb_id?: string
}

let cachedTotalPages: number | null = null

export default defineEventHandler(async (): Promise<MovieIdeaResponse> => {
  const config = useRuntimeConfig()
  const apiKey = config.tmdbApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key missing. Set TMDB_API_KEY in environment.',
    })
  }

  // Fetch total pages once (top rated movies) then pick a random page/result.
  if (!cachedTotalPages) {
    const firstPage = await $fetch<TmdbPage>(
      `https://api.themoviedb.org/3/movie/top_rated?language=fr-FR&include_adult=false&page=1&api_key=${apiKey}`,
      { headers: { Accept: 'application/json' } },
    ).catch((err) => {
      console.error('TMDB top_rated first page failed', err)
      throw createError({
        statusCode: 502,
        statusMessage: 'Impossible de récupérer un film depuis TMDB.',
      })
    })
    cachedTotalPages = Math.min(firstPage.total_pages ?? 1, 500) // TMDB caps pages at 500
  }

  const randomPage = Math.max(1, Math.floor(Math.random() * cachedTotalPages) + 1)

  const pageData = await $fetch<TmdbPage>(
    `https://api.themoviedb.org/3/movie/top_rated?language=fr-FR&include_adult=false&page=${randomPage}&api_key=${apiKey}`,
    { headers: { Accept: 'application/json' } },
  ).catch((err) => {
    console.error('TMDB top_rated random page failed', err)
    throw createError({
      statusCode: 502,
      statusMessage: 'Impossible de récupérer un film depuis TMDB.',
    })
  })

  const candidates = pageData.results ?? []
  if (!candidates.length) {
    throw createError({ statusCode: 502, statusMessage: 'Aucun film trouvé sur TMDB.' })
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)]

  const locale = Math.random() < 0.8 ? 'vo' : 'vf'
  const year = pick.release_date?.slice(0, 4) ?? ''
  let letterboxdUrl: string

  if (pick.id) {
    const details = await $fetch<TmdbMovieDetails | undefined>(
      `https://api.themoviedb.org/3/movie/${pick.id}?language=fr-FR&api_key=${apiKey}`,
      { headers: { Accept: 'application/json' } },
    ).catch((err) => {
      console.error('TMDB movie details failed', err)
      return undefined
    })
    if (details?.imdb_id) {
      letterboxdUrl = `https://letterboxd.com/imdb/${details.imdb_id}/`
    } else {
      const searchQuery = `${pick.title ?? ''} ${year}`.trim()
      letterboxdUrl = searchQuery
        ? `https://letterboxd.com/search/${encodeURIComponent(searchQuery)}/`
        : 'https://letterboxd.com/search/'
    }
  } else {
    const searchQuery = `${pick.title ?? ''} ${year}`.trim()
    letterboxdUrl = searchQuery
      ? `https://letterboxd.com/search/${encodeURIComponent(searchQuery)}/`
      : 'https://letterboxd.com/search/'
  }

  return {
    title: pick.title ?? 'Film surprise',
    poster: pick.poster_path
      ? `https://image.tmdb.org/t/p/w500${pick.poster_path}`
      : null,
    locale,
    letterboxdUrl,
    year,
  }
})

