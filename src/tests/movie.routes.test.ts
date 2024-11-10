import request from "supertest";
import { Request, Response } from "express";
import app from "../app"; // Make sure this is the correct path to your Express app
import { movie_controller } from "../controllers/movie.controller";
import {
  INVALID_METHOD_ERROR_MESSAGE,
  INVALID_PARAMETER_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../constants";
import { getMoviesByYear } from "../services/movie.service";

jest.mock("../services/movie.service");

describe("MovieController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and movie data when year is valid", async () => {
    (getMoviesByYear as jest.Mock).mockResolvedValue([
      {
        title: "Joker",
        release_date: "January 1, 2019",
        vote_average: 8.19,
        editors: ["Editor 1", "Editor 2"],
      },
    ]);

    const response = await request(app).get("/api/v1/movies/2019");

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Joker");
    expect(response.body[0].release_date).toBe("January 1, 2019");
    expect(response.body[0].vote_average).toBe(8.19);
  });

  it("should return 404 if year is missing", async () => {
    const response = await request(app).get("/movies/");

    expect(response.status).toBe(404);
  });

  it("should return 400 if year is invalid", async () => {
    jest
      .spyOn(movie_controller, "getMovies")
      .mockImplementation(async (req, res) => {
        res.status(400).json({ message: INVALID_PARAMETER_MESSAGE });
        return;
      });

    const response = await request(app).get("/api/v1/movies/abcd");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", INVALID_PARAMETER_MESSAGE);
  });

  it("should return 405 if method is invalid", async () => {
    const response = await request(app).post("/api/v1/movies/abcd");

    expect(response.status).toBe(405);
    expect(response.body).toHaveProperty(
      "message",
      INVALID_METHOD_ERROR_MESSAGE
    );
  });

  it("should return 500 for internal server errors", async () => {
    (getMoviesByYear as jest.Mock).mockRejectedValue(
      new Error("Internal server error")
    );

    const response = await request(app).get("/api/v1/movies/2019");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "message",
      INTERNAL_SERVER_ERROR_MESSAGE
    );
  });

  it("should fail gracefully if credit api fails", async () => {
    (getMoviesByYear as jest.Mock).mockResolvedValue([
      {
        title: "Joker",
        release_date: "January 1, 2019",
        vote_average: 8.19,
        editors: [],
      },
    ]);

    const response = await request(app).get("/api/v1/movies/2019");

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Joker");
    expect(response.body[0].release_date).toBe("January 1, 2019");
    expect(response.body[0].vote_average).toBe(8.19);
  });
});
