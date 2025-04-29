import React, { useState } from 'react';

export default function GrantOrRevokePilotLicense() {
  const [form, setForm] = useState({
    personID: '',
    license: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/grant_or_revoke_pilot_license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'License granted or revoked!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      personID: '',
      license: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>Procedure: Grant or Revoke Pilot License</h2>

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

      <label>
        License:
        <input
          type="text"
          name="license"
          value={form.license}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button type="submit">Add / Revoke</button>
      </div>
    </form>
  );
}
