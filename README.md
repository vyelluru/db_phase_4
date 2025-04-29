# Instructions to Setup/Run
1. Clone/download repository
2. `cd` into the repository root and open separate terminal windows for frontend and backend:
   1. Database setup:
      1. Open MySQL Workbench and click into a local instance
      2. Open `db_phase_4/sql/cs4400_sams_phase3_database_v3.sql` and run it
      3. Open `db_phase_4/sql/vcs4400_phase3_stored_procedures_team103.sql` and run it
   2. Frontend setup:
      1. `cd frontend`
      2. `npm install` - install dependencies
      3. `npm run dev` - run the frontend in dev mode locally
   3. Backend setup:
      1. `cd backend`
      2. Add `.env` at backend root (`/backend/.env`) and set your MySQL workbench instance password and `port=4000`
        ```
            DB_PASSWORD="<MySQL-workbench-password>"
            port=4000
        ```
      3. `npm install` - install dependencies
      4. `npm start` - run the backend server locally

# Technologies Used
1. Frontend:
   - React JS + Vite
   - Use React Router and establish a route for each SQL call/procedure for modularity in `App.jsx`
   - In `/src/components/`, each route has a file with the associated form for user input, as well as logic to handle dispatching requests to the backend server
2. Backend + MySQL:
    - Express JS
    - In `server.js`, each SQL call/procedure is registered to an endpoint that listens for requests from the frontend
    - In `/routes/`, each route is associated with a function that performs the SQL query from the local database instance when that route is invoked

# Contributions
### Varun: 
- form routes and endpoints for each SQL query in the app
- troubleshoot/debug routes
### Sashank:
- form routes and endpoints for each SQL query in the app
- troubleshoot/debug routes
### Hari:
- Fix/debug SQL queries from Phase III to make sure the app backend ran correctly
### Sahil: 
- troubleshoot/debug routes
- logging for the frontend/backend
- README creation
