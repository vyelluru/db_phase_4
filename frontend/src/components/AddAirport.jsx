import React, { useState } from 'react';

export default function AddAirport() {
  const [form, setForm] = useState({
    airportID: '',
    airport_name: '',
    city: '',
    state: '',
    country: '',
    locationID: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/add_airport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      alert(data.message || 'Airport added!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      airportID: '',
      airport_name: '',
      city: '',
      state: '',
      country: '',
      locationID: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>Procedure: Add Airport</h2>

      <label>
        Airport ID:
        <input
          type="text"
          name="airportID"
          value={form.airportID}
          onChange={handleChange}
          maxLength={3}
          required
        />
      </label>

      <label>
        Airport Name:
        <input
          type="text"
          name="airport_name"
          value={form.airport_name}
          onChange={handleChange}
          maxLength={200}
        />
      </label>

      <label>
        City:
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>

      <label>
        State:
        <input
          type="text"
          name="state"
          value={form.state}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>

      <label>
        Country:
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          maxLength={3}
          required
        />
      </label>

      <label>
        Location ID:
        <input
          type="text"
          name="locationID"
          value={form.locationID}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
