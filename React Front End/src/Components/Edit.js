import React, { useState, useEffect } from 'react';
import './Save.css';

const Edit = ({ pointId, onClose, onClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    x: 0.0,
    y: 0.0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(pointId);
        const response = await fetch(`http://localhost:8080/api/${pointId}`);
        const data = await response.json();
        setFormData({
          name: data.name,
          x: data.point.x.toString(),
          y: data.point.y.toString()
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [pointId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name,
      x: parseFloat(formData.x),
      y: parseFloat(formData.y)
    };
    console.log(JSON.stringify(dataToSend));
    // API Put-Aufruf hier durchführen, um die aktualisierten Daten zu speichern
    fetch(`http://localhost:8080/api/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
      .then(response => response.json())
      .then(data => {
        // Verarbeite die Antwort der API hier
        console.log(data);
        onClose();
        onClick();
      })
      .catch(error => {
        // Behandle Fehler hier
        console.error(error);
      });
  };


  return (
    <div className='popup'>
      <div className='popup-content'>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            X-Koordinate:
            <input
              type="number"
              step="0.1"
              name="x"
              value={formData.x}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Y-Koordinate:
            <input
              type="number"
              step="0.1"
              name="y"
              value={formData.y}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
          <button onClick={onClose}>Schließen</button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
