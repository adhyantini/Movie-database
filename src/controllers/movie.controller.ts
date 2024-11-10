import { Request, Response } from "express";
import { getMoviesByYear } from "../services/movie.service";
import {
  AUTHENTICATION_FAILED_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  INVALID_PARAMETER_MESSAGE,
} from "../constants";
import axios from "axios";

class MovieController {
  /**
   * Handles the request to get movies released in a specific year.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<void>}
   */
  getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year } = req.params;

      const yearRegex = /^\d{4}$/;

      // Check for a valid year
      if (!yearRegex.test(year) || parseInt(year) <= 0) {
        res.status(400).json({ message: INVALID_PARAMETER_MESSAGE });
        return;
      }

      // Make API call to service to fetch all the movies by year
      const movies = await getMoviesByYear(year);
      res.json(movies);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        /* istanbul ignore next */
        if (error.response?.status == 401) {
          res
            .send(401)
            .json({
              message:
                error.response.data.status_message ||
                AUTHENTICATION_FAILED_MESSAGE,
            });
          return;
          /* istanbul ignore next */
        } else if (error.response?.status == 404) {
          res.send(404).json({ NOT_FOUND_ERROR_MESSAGE });
          return;
        }
        /* istanbul ignore next */
        res
          .status(500)
          .json({
            message:
              error.response?.data.status_message ||
              error.message ||
              INTERNAL_SERVER_ERROR_MESSAGE,
          });
        return;
      } else {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    }
  };
}

export const movie_controller = new MovieController();
