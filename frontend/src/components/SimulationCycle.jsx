import React from 'react';

export default function SimulationCycle() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/simulation_cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || 'Simulation step completed successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    // No form fields to clear for simulation_cycle
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '400px' }}>
      <h2>Procedure: Simulation Cycle</h2>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button type="submit">Next Step</button>
      </div>
    </form>
  );
}
