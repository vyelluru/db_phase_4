import React, { useState } from 'react';

export default function FlightTakeoff() {
  const [flightID, setFlightID] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/flight_takeoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightID }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'Flight takeoff processed!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFlightID('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '400px' }}>
      <h2>Procedure: Flight Takeoff</h2>

      <label>
        Flight ID:
        <input
          type="text"
          name="flightID"
          value={flightID}
          onChange={(e) => setFlightID(e.target.value)}
          maxLength={50}
          required
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button type="submit">Takeoff</button>
      </div>
    </form>
  );
}
