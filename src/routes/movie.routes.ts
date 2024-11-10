import express from "express";
import { onlyAllowGet } from "../middleware/middleware";
import { movie_controller } from "../controllers/movie.controller";

//initiating the router
export const router = express.Router();
router.use("/movies/:year", onlyAllowGet);

// GET movies route
router.get("/movies/:year", movie_controller.getMovies);
