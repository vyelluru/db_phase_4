import { useEffect, useState } from 'react';

function FlightsOnTheGround() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchView = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/flights-on-the-ground');
        if (!res.ok) throw new Error((await res.json()).error || res.statusText);
        const { data } = await res.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchView();
  }, []);

  return (
    <div>
      <h1>Flights Currently on the Ground</h1>
      <p>This view shows all flights that are currently on the ground.</p>

      {!loading && !error && data.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                {Object.keys(data[0]).map((col) => (
                <th key={col}>{col}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, i) => (
                <tr key={i}>
                {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        )}

    </div>
  );
}

export default FlightsOnTheGround;
