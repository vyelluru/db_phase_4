import React, { useState } from 'react';

export default function AddAirplane() {
  const [form, setForm] = useState({
    airlineID: '',
    tail_num: '',
    seat_capacity: '',
    speed: '',
    locationID: '',
    plane_type: '',
    maintenanced: '',
    model: '',
    neo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const maintenancedVal = None;
      const neoVal = None;

      if (form.maintenanced.toLowerCase() === 'true') {
        maintenancedVal = 1;
      } else if (form.maintenanced.toLowerCase() === 'false') {
        maintenancedVal = 0;
      }

      if (form.neo.toLowerCase() === 'true') {
        neoVal = 1;
      } else if (form.neo.toLowerCase() === 'false') {
        neoVal = 0;
      }

      const res = await fetch('http://localhost:4000/api/add_airplane', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          seat_capacity: parseInt(form.seat_capacity),
          speed: parseInt(form.speed),
          maintenanced: maintenancedVal,
          neo: neoVal
        })
      });


      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      alert(data.message || 'Airplane added!');      
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      airlineID: '',
      tail_num: '',
      seat_capacity: '',
      speed: '',
      locationID: '',
      plane_type: '',
      maintenanced: '',
      model: '',
      neo: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>Procedure: Add Airplane</h2>

      <label>
        Airline ID:
        <input type="text" name="airlineID" value={form.airlineID} onChange={handleChange} maxLength={50} required />
      </label>

      <label>
        Tail Num:
        <input type="text" name="tail_num" value={form.tail_num} onChange={handleChange} maxLength={50} required />
      </label>

      <label>
        Seat Capacity:
        <input type="number" name="seat_capacity" value={form.seat_capacity} onChange={handleChange} min={1} required />
      </label>

      <label>
        Speed:
        <input type="number" name="speed" value={form.speed} onChange={handleChange} min={1} required />
      </label>

      <label>
        Location ID:
        <input type="text" name="locationID" value={form.locationID} onChange={handleChange} maxLength={50} required />
      </label>

      <label>
        Plane Type:
        <select name="plane_type" value={form.plane_type} onChange={handleChange}>
          <option value="neither">neither</option>
          <option value="Boeing">Boeing</option>
          <option value="Airbus">Airbus</option>
        </select>
      </label>

      <label>
        Maintenanced:
        <select name="maintenanced" value={form.maintenanced} onChange={handleChange}>
          <option value="">NULL</option>
          <option value="true">TRUE</option>
          <option value="false">FALSE</option>
        </select>
      </label>

      <label>
        Model:
        <input type="text" name="model" value={form.model} onChange={handleChange} maxLength={50} />
      </label>

      <label>
        Neo:
        <select name="neo" value={form.neo} onChange={handleChange}>
          <option value="">NULL</option>
          <option value="true">TRUE</option>
          <option value="false">FALSE</option>
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>Cancel</button>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
