# Movie Database API

## Overview
This project is a Node.js and TypeScript-based RESTful API that interacts with The Movie Database (TMDB) API. It allows users to fetch movies by year and returns movie details sorted by popularity, along with the list of editors involved in each movie. This project is designed to be robust, scalable, and secure, adhering to best coding practices.

## Features
- **Fetch movies by year**: Retrieve a list of movies for a given year, sorted by descending popularity.
- **Editor details**: Provides a list of editors associated with each movie.
- **Error handling**: Graceful error handling with proper HTTP status codes.
- **Security**: Secure use of environment variables for sensitive data.
- **Middleware**: Includes custom middleware to allow only `GET` requests.
- **Comprehensive unit tests**: Coverage for controllers and service methods.

## Tech Stack
- **Node.js** (v21 or higher)
- **TypeScript**
- **Express.js**
- **Axios** for HTTP requests
- **Jest** and **Supertest** for testing

## Installation and Setup
1. **Clone the repository**:
    ```bash
    git clone https://github.com/adhyantini/Movie-database.git
    cd movie-database
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create a `.env` file**:
   Create a `.env` file at the root of your project and add your TMDB access token:
    ```env
    TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
    PORT=3000 # or any available port
    ```

4. **Run the project**:
    ```bash
    npm start
    ```

5. **Transpile TypeScript code**:
    ```bash
    npm run build
    ```

6. **Run tests**:
    ```bash
    npm test
    ```

## Contact Information
Name - Adhyantini Bogawat
Email - adhyantini.bogawat@gmail.com