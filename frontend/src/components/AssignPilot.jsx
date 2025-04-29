import React, { useState } from 'react';

export default function AssignPilot() {
  const [form, setForm] = useState({
    flightID: '',
    personID: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/assign_pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightID: form.flightID,
          personID: form.personID
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'Pilot assigned successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      flightID: '',
      personID: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '400px' }}>
      <h2>Procedure: Assign Pilot</h2>

      <label>
        Flight ID:
        <input
          type="text"
          name="flightID"
          value={form.flightID}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </label>

      <label>
        Person ID:
        <input
          type="text"
          name="personID"
          value={form.personID}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button type="submit">Assign</button>
      </div>
    </form>
  );
}
