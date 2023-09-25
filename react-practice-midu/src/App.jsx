import './App.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies.jsx'
import debounce from 'just-debounce-it'


function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if(search === '') {
      setError('No se puede buscar una pelicula vacia.')
      return
    }
 
    if(search.match( /[^a-zA-Z0-9]/g )) {
      setError('No se puede buscar una pelicula con caracteres especiales.')
      return
    }
 
    if(search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres.')
      return
    } 
 
    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort , setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
       getMovies({ search })
    }, 300)
   , [getMovies]
  )

  const handleSubmit = (event) => {
   event.preventDefault()
   getMovies({ search })
 }

 const handleSort = () => {
   setSort(! sort)
 }

 const handleChange = (event) => {
  const newSearch = event.target.value
  updateSearch(newSearch)
  debouncedGetMovies(newSearch)
 }


  return (
    <div className="page">

    <header>
      <h1>BUSCADOR DE PELICULAS</h1>
      <form className='form' onSubmit={handleSubmit}>
        <input onChange={handleChange} value={search} name='query' placeholder='Avengers, star wars, matrix' type="text" />
        <input type="checkbox" onChange={handleSort} checked={sort} />
        <button type='submit'>Buscar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </header>

    <main>
      {
        loading ? <p>Cargando...</p> : <Movies movies={movies}/> 
      }
    </main>
    </div> 
  )
}

export default App
