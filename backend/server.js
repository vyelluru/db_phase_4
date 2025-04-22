const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD, // password in .env file
  database: 'flight_tracking',
  port: 3306
});

const flightsInTheAirRouter = require('./routes/flights_in_the_air')(pool);
app.use('/api/flights-in-the-air', flightsInTheAirRouter);

const flightsOnTheGroundRouter = require('./routes/flights_on_the_ground')(pool);
app.use('/api/flights-on-the-ground', flightsOnTheGroundRouter);

const peopleInTheAirRouter = require('./routes/people_in_the_air')(pool);
app.use('/api/people-in-the-air', peopleInTheAirRouter);

const peopleOnTheGroundRouter = require('./routes/people_on_the_ground')(pool);
app.use('/api/people-on-the-ground', peopleOnTheGroundRouter);

const routeSummaryRouter = require('./routes/route_summary')(pool);
app.use('/api/route-summary', routeSummaryRouter);

const alternativeAirportsRouter = require('./routes/alternative_airports')(pool);
app.use('/api/alternative-airports', alternativeAirportsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});