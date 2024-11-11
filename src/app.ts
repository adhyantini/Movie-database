import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/movie.routes";

require("dotenv").config();
const app = express();
/* istanbul ignore next */
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

export default app;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
