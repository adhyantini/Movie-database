import axios from "axios";
import { getMoviesByYear } from "../services/movie.service";
import { TMDB_URL, MOVIE_DISCOVER_URL } from "../constants";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getMoviesByYear", () => {
  const year = "2019";
  const ACCESS_TOKEN = "test_token";

  beforeEach(() => {
    process.env.TMDB_ACCESS_TOKEN = ACCESS_TOKEN;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of movies with editors when API calls succeed", async () => {
    // Mock response for the discover movies API
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            title: "Joker",
            release_date: "2019-01-01",
            vote_average: 8.19,
          },
        ],
      },
    });

    // Mock response for the credits API
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        crew: [
          { known_for_department: "Editing", name: "Editor 1" },
          { known_for_department: "Editing", name: "Editor 2" },
        ],
      },
    });

    const movies = await getMoviesByYear(year);

    expect(movies).toEqual([
      {
        title: "Joker",
        release_date: "2019-01-01",
        vote_average: 8.19,
        editors: ["Editor 1", "Editor 2"],
      },
    ]);

    // Verify that the correct URLs were called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${TMDB_URL}${MOVIE_DISCOVER_URL}?language=en-US&page=1&primary_release_year=${year}&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  });

  it("should return a movie with an empty editors list if the credits API fails", async () => {
    // Mock response for the discover movies API
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 2,
            title: "Sample Movie",
            release_date: "2019-01-02",
            vote_average: 7.5,
          },
        ],
      },
    });

    // Mock failure for the credits API
    mockedAxios.get.mockRejectedValueOnce(new Error("Credits API failed"));

    const movies = await getMoviesByYear(year);

    expect(movies).toEqual([
      {
        title: "Sample Movie",
        release_date: "2019-01-02",
        vote_average: 7.5,
        editors: [],
      },
    ]);
  });

  it("should throw an error if the discover movies API fails", async () => {
    // Mock failure for the discover movies API
    mockedAxios.get.mockRejectedValueOnce(new Error("Discover API failed"));

    await expect(getMoviesByYear(year)).rejects.toThrow("Discover API failed");
  });
});
