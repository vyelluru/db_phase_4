import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FlightsInTheAir from './components/FlightsInTheAir';
import FlightsOnTheGround from './components/FlightsOnTheGround';
import PeopleInTheAir from './components/PeopleInTheAir';
import PeopleOnTheGround from './components/PeopleOnTheGround';
import RouteSummary from './components/RouteSummary';
import AlternativeAirports from './components/AlternativeAirports';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
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
        {/* Add more */}
      </Routes>
    </Router>
  );
}

export default App;