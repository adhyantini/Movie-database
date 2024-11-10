import express from "express";
import { onlyAllowGet } from "../middleware/middleware";
import { movie_controller } from "../controllers/movie.controller";
import { MISSING_YEAR_PARAMETER_MESSAGE } from "../constants";

//initiating the router
export const router = express.Router();

// Middleware to handle missing `year` parameter
router.get("/movies", (req, res) => {
  res.status(400).json({
    message: MISSING_YEAR_PARAMETER_MESSAGE,
  });
});
router.use("/movies/:year", onlyAllowGet);

// GET movies route
router.get("/movies/:year", movie_controller.getMovies);
