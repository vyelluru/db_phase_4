import React, { useState } from 'react';

export default function OfferFlight() {
  const [form, setForm] = useState({
    flightID: '',
    routeID: '',
    support_airline: '',
    support_tail: '',
    progress: '',
    next_time: '',
    cost: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/offer_flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          progress: form.progress !== '' ? parseInt(form.progress) : null,
          cost: form.cost !== '' ? parseInt(form.cost) : null
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'Flight offered successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      flightID: '',
      routeID: '',
      support_airline: '',
      support_tail: '',
      progress: '',
      next_time: '',
      cost: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '700px' }}>
      <h2>Procedure: Offer Flight</h2>

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
        Route ID:
        <input
          type="text"
          name="routeID"
          value={form.routeID}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </label>

      <label>
        Support Airline:
        <input
          type="text"
          name="support_airline"
          value={form.support_airline}
          onChange={handleChange}
          maxLength={50}
        />
      </label>

      <label>
        Support Tail:
        <input
          type="text"
          name="support_tail"
          value={form.support_tail}
          onChange={handleChange}
          maxLength={50}
        />
      </label>

      <label>
        Progress:
        <input
          type="number"
          name="progress"
          value={form.progress}
          onChange={handleChange}
          min={0}
          required
        />
      </label>

      <label>
        Next Time:
        <input
          type="time"
          name="next_time"
          value={form.next_time}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Cost:
        <input
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          min={0}
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
