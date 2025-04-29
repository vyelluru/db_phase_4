const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD, // password in .env file
  database: 'flight_tracking',
  port: 3306
});

const addAirplane = require('./routes/add_airplane')(pool);
app.use('/api/add_airplane', addAirplane);

const addAirport = require('./routes/add_airport')(pool);
app.use('/api/add_airport', addAirport);

const addPerson = require('./routes/add_person')(pool);
app.use('/api/add_person', addPerson);

const grantOrRevokePilotLicense = require('./routes/grant_or_revoke_pilot_license')(pool);
app.use('/api/grant_or_revoke_pilot_license', grantOrRevokePilotLicense);

const offerFlight = require('./routes/offer_flight')(pool);
app.use('/api/offer_flight', offerFlight);

const flightLanding = require('./routes/flight_landing')(pool);
app.use('/api/flight_landing', flightLanding);

const flightTakeoff = require('./routes/flight_takeoff')(pool);
app.use('/api/flight_takeoff', flightTakeoff);

const passengersBoard = require('./routes/passengers_board')(pool);
app.use('/api/passengers_board', passengersBoard);

const passengersDisembark = require('./routes/passengers_disembark')(pool);
app.use('/api/passengers_disembark', passengersDisembark);

const assignPilot = require('./routes/assign_pilot')(pool);
app.use('/api/assign_pilot', assignPilot);

const recycleCrew = require('./routes/recycle_crew')(pool);
app.use('/api/recycle_crew', recycleCrew);

const retireFlight = require('./routes/retire_flight')(pool);
app.use('/api/retire_flight', retireFlight);

const simulationCycle = require('./routes/simulation_cycle')(pool);
app.use('/api/simulation_cycle', simulationCycle);

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