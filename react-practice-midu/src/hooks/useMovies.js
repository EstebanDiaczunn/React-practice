import { useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'
import { useRef } from 'react'

export function useMovies({ search, sort }) {
    const [movies, setMovies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const prevSearch = useRef(search)

    const getMovies = useCallback(async ({ search }) => {
        if(search === prevSearch.current) return

        try {
            setLoading(true)
            setError(null)
            prevSearch.current = search
            const newMovies = await searchMovies({ search })
            setMovies(newMovies)   
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const sortedMovies = useMemo(() => {
        return sort 
        ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
        : movies
    }, [sort, movies])

    return { movies: sortedMovies, getMovies, loading, error }
}