import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Save.css';

const DistanceCalculator = ({onClose}) => {
    const [places, setPlaces] = useState([]);
    const [selectedPlace1, setSelectedPlace1] = useState("");
    const [selectedPlace2, setSelectedPlace2] = useState("");
    const [distance, setDistance] = useState(null);
  
    useEffect(() => {
      // Laden Sie alle Orte von der API
      axios.get('http://localhost:8080/api/all')
        .then(response => {
          // Die Antwort enthält ein Array von Orten
          const placesData = response.data;
          // Konvertieren Sie das Array in das Format, das von react-select erwartet wird
          const formattedPlaces = placesData.map(place => ({
            value: place.name,
            label: place.name
          }));
          // Setzen Sie den Zustand der Orte
          setPlaces(formattedPlaces);
        })
        .catch(error => {
          console.error('Fehler beim Laden der Orte:', error);
        });
    }, []);

  const handlePlace1Change = selectedOption => {
    setSelectedPlace1(selectedOption);
  };
  
  const handlePlace2Change = selectedOption => {
    setSelectedPlace2(selectedOption);
  };

  const calculateDistance = () => {
    Promise.all([
      axios.get('http://localhost:8080/api/cache/flush'),
      axios.get('http://localhost:8080/api/cache')
    ])
      .then(() => {
        if (selectedPlace1 && selectedPlace2) {
          const url = `http://localhost:8080/api/${selectedPlace1.value}/distance/${selectedPlace2.value}`;
          axios.get(url)
            .then(response => {
              setDistance(response.data.value);
            })
            .catch(error => {
              console.error('Fehler beim Berechnen der Entfernung:', error);
            });
        }
      })
      .catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
      });
  };
  

  return (
    <div className='popup'>
      <div className='popup-content'>
    <div>
      <h2>Entfernungsberechner</h2>
      <Select
        options={places}
        value={selectedPlace1}
        onChange={handlePlace1Change}
        placeholder="Ort 1 auswählen"
      />
      <Select
        options={places}
        value={selectedPlace2}
        onChange={handlePlace2Change}
        placeholder="Ort 2 auswählen"
      />
      <button onClick={calculateDistance}>Entfernung berechnen</button>
      {distance != null && <p>Die Entfernung beträgt: {distance} km</p>}
      <button onClick={onClose}>Schließen</button>
    </div>
    </div>
    </div>
  );
};
export default DistanceCalculator;