const API_KEY = 'ced83653'

export const searchMovies = async ({ search }) => {
    if(search === '') return null

    try {
        const respose = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await respose.json()

        const movies = json.Search

        return movies?.map(movie => ({
          id: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster
        }))
    } catch (e) {
        console.log(e)
        throw new Error(e)        
    }
}