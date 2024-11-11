import axios from "axios";
import {
  TMDB_URL,
  MOVIE_DISCOVER_URL,
  EDITING_DEPARTMENT_FILTER,
  PAGE_FILTER,
  LANGUAGE_FILTER,
} from "../constants";
const TMDB_BASE_URL = TMDB_URL;

/**
 * Fetches movies released in a given year from the TMDB API and returns an array of movie details,
 * including title, release date, vote average, and a list of editors.
 * @param {string} year - The year in YYYY format for which movies need to be fetched.
 * @returns {Promise<any[]>} A promise that resolves to an array of movie objects.
 */
export async function getMoviesByYear(year: string): Promise<any[]> {
  try {
    // Retrieve access token from environment variables
    const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

    // Define request headers for authorization and content type
    const header = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

     // Construct the URL to fetch movies based on the given year
    const discoverUrl = `${TMDB_BASE_URL}${MOVIE_DISCOVER_URL}?language=${LANGUAGE_FILTER}&page=${PAGE_FILTER}&primary_release_year=${year}&sort_by=popularity.desc`;
    //Fetch all movies by year from Discover movie API
    const { data } = await axios.get(discoverUrl, {
      headers: header,
    });

    // Map over each movie to fetch the list of editors from the Credits API
    const movies = data.results.map(async (movie: any) => {
      const creditsUrl = `${TMDB_BASE_URL}/movie/${movie.id}/credits`;
      try {
        const creditsResponse = await axios.get(creditsUrl, {
          headers: header,
        });

         // Filter crew members to include only those in the editing department
        const editors = creditsResponse.data.crew
          .filter(
            (member: any) =>
              member.known_for_department === EDITING_DEPARTMENT_FILTER
          )
          .map((editor: any) => editor.name);
        
        // Return the movie object with its relevant details and editors
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: editors,
        };
      } catch {
         // Return movie details without editors if fetching credits fails
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: [],
        };
      }
    });

    // Wait for all movie promises to resolve and return the result
    return Promise.all(movies);
  } catch (error) {
     // Rethrow any errors encountered during the fetch process
    throw error;
  }
}
