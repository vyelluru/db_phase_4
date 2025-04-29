import React, { useState } from 'react';

export default function AddPerson() {
  const [form, setForm] = useState({
    personID: '',
    first_name: '',
    last_name: '',
    locationID: '',
    taxID: '',
    experience: '',
    miles: '',
    funds: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/add_person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          experience: form.experience !== '' ? parseInt(form.experience) : null,
          miles: form.miles !== '' ? parseInt(form.miles) : null,
          funds: form.funds !== '' ? parseInt(form.funds) : null,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'Person added!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      personID: '',
      first_name: '',
      last_name: '',
      locationID: '',
      taxID: '',
      experience: '',
      miles: '',
      funds: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>Procedure: Add Person</h2>

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
        First Name:
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>

      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          maxLength={100}
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

      <label>
        Tax ID:
        <input
          type="text"
          name="taxID"
          value={form.taxID}
          onChange={handleChange}
          maxLength={50}
        />
      </label>

      <label>
        Experience:
        <input
          type="number"
          name="experience"
          value={form.experience}
          onChange={handleChange}
          min={0}
        />
      </label>

      <label>
        Miles:
        <input
          type="number"
          name="miles"
          value={form.miles}
          onChange={handleChange}
          min={0}
        />
      </label>

      <label>
        Funds:
        <input
          type="number"
          name="funds"
          value={form.funds}
          onChange={handleChange}
          min={0}
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
