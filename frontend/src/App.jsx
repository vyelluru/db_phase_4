import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FlightsInTheAir from './components/FlightsInTheAir';
import FlightsOnTheGround from './components/FlightsOnTheGround';
import PeopleInTheAir from './components/PeopleInTheAir';
import PeopleOnTheGround from './components/PeopleOnTheGround';
import RouteSummary from './components/RouteSummary';
import AlternativeAirports from './components/AlternativeAirports';
import AddAirplane from './components/AddAirplane';
import AddAirport from './components/AddAirport';
import AddPerson from './components/AddPerson';
import AssignPilot from './components/AssignPilot';
import FlightLanding from  './components/FlightLanding';
import GrantOrRevokePilotLicense from  './components/GrantOrRevokePilotLicense';
import OfferFlight from  './components/OfferFlight';
import FlightTakeoff from './components/FlightTakeoff';
import PassengersBoard from './components/PassengersBoard';
import PassengersDisembark from './components/PassengersDisembark';
import RecycleCrew from './components/RecycleCrew';
import RetireFlight from './components/RetireFlight';
import SimulationCycle from './components/SimulationCycle';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <p></p>
        <Link to="/add-airplane">Add Airplane</Link>
        <p></p>
        <Link to="/add-airport">Add Airport</Link>
        <p></p>
        <Link to="/add-person">Add Person</Link>
        <p></p>
        <Link to="/grant-or-revoke-pilot-license">Grant or Revoke Pilot License</Link>
        <p></p>
        <Link to="/offer-flight">Offer Flight</Link>
        <p></p>
        <Link to="/flight-landing">Flight Landing</Link>
        <p></p>
        <Link to="/flight-takeoff">Flight Takeoff</Link>
        <p></p>
        <Link to="/passengers-board">Passengers Board</Link>
        <p></p>
        <Link to="/passengers-disembark">Passengers Disembark</Link>
        <p></p>
        <Link to="/assign-pilot">Assign Pilot</Link>
        <p></p>
        <Link to="/recycle-crew">Recycle Crew</Link>
        <p></p>
        <Link to="/retire-flight">Retire Flight</Link>
        <p></p>
        <Link to="/simulation-cycle">Simulation Cycle</Link>
        <p></p>
        <Link to="/flights-in-the-air">Flights in the Air</Link>
        <p></p>
        <Link to="/flights-on-the-ground">Flights on the Ground</Link>
        <p></p>
        <Link to="/people-in-the-air">People in the Air</Link>
        <p></p>
        <Link to="/people-on-the-ground">People on the Ground</Link>
        <p></p>
        <Link to="/route-summary">Route Summary</Link>
        <p></p>
        <Link to="/alternative-airports">Alternative Airports</Link>
      </nav>
      <Routes>
        <Route path="/flights-in-the-air" element={<FlightsInTheAir />} />
        <Route path="/flights-on-the-ground" element={<FlightsOnTheGround />} />
        <Route path="/people-in-the-air" element={<PeopleInTheAir />} />
        <Route path="/people-on-the-ground" element={<PeopleOnTheGround />} />
        <Route path="/route-summary" element={<RouteSummary />} />
        <Route path="/alternative-airports" element={<AlternativeAirports />} />
        <Route path="/add-airplane" element={<AddAirplane />} />
        <Route path="/add-airport" element={<AddAirport />} />
        <Route path="/add-person" element={<AddPerson />} />
        <Route path="/grant-or-revoke-pilot-license" element={<GrantOrRevokePilotLicense />} />
        <Route path="/offer-flight" element={<OfferFlight />} />
        <Route path="/flight-landing" element={<FlightLanding />} />
        <Route path="/flight-takeoff" element={<FlightTakeoff />} />
        <Route path="/passengers-board" element={<PassengersBoard />} />
        <Route path="/passengers-disembark" element={<PassengersDisembark />} />
        <Route path="/assign-pilot" element={<AssignPilot />} />
        <Route path="/recycle-crew" element={<RecycleCrew />} />
        <Route path="/retire-flight" element={<RetireFlight />} />
        <Route path="/simulation-cycle" element={<SimulationCycle />} />
        {/* Add more */}
      </Routes>
    </Router>
  );
}

export default App;