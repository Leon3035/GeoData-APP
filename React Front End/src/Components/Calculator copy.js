import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Save.css';

const RadiusCalculator = ({ onClose }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace1, setSelectedPlace1] = useState("");
  const [radius, setRadius] = useState("");
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/all')
      .then(response => {
        const placesData = response.data;
        const formattedPlaces = placesData.map(place => ({
          value: place.name,
          label: place.name
        }));
        setPlaces(formattedPlaces);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Orte:', error);
      });
  }, []);

  const handlePlace1Change = selectedOption => {
    setSelectedPlace1(selectedOption);
  };

  const handleRadiusChange = event => {
    setRadius(event.target.value);
  };

  const calculateRadius = () => {
    Promise.all([
      axios.get('http://localhost:8080/api/cache/flush'),
      axios.get('http://localhost:8080/api/cache')
    ])
      .then(() => {
        if (selectedPlace1 && radius) {
          console.log(selectedPlace1);
          const url = `http://localhost:8080/api/${selectedPlace1.value}/nearby/${radius}`;
          console.log(url);
          axios.get(url)
            .then(response => {
              var distance = "";
              for (let i = 0; i < response.data.length; i++) {
                if (i > 0){
                  distance += ", ";
                }
                distance += response.data[i];
              }
              console.log(distance);
              setDistance(distance);
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
          <input
            type="text"
            placeholder="Radius"
            value={radius}
            onChange={handleRadiusChange}
          />
          <button onClick={calculateRadius}>Check Radius</button>
          {distance != null && (
            <p>Im Radius von {radius} km befinden sich: {distance}</p>
          )}
          <button onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
};

export default RadiusCalculator;
