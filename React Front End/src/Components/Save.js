import React, { useState } from 'react';
import './Save.css';

const Save = ({ onClose, onClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    x: '0.0',
    y: '0.0'
  });

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

    // API Post-Aufruf hier durchführen
    fetch('http://localhost:8080/api/save', {
      method: 'POST',
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

export default Save;
