import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import Save from "./Save.js";
import DistanceCalculator from './Calculator.js';
import Table from './Table.js';
import RadiusCalculator from './Calculator copy.js';


const defaultIcon = new Icon({
  iconUrl: require("./location-pin.png"),
  iconSize: [25, 25]
});

const Map = () => {
  const [points, setPoints] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [showPopup4, setShowPopup4] = useState(false);
  const [latlng, setLatLng] = useState(undefined);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup2 = () => {
    setShowPopup2(true);
  };

  const closePopup2 = () => {
    setShowPopup2(false);
  };

  const openPopup3 = () => {
    setShowPopup3(true);
  };

  const closePopup3 = () => {
    setShowPopup3(false);
  };

  const openPopup4 = () => {
    setShowPopup4(true);
  };

  const closePopup4 = () => {
    setShowPopup4(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/all', { responseType: 'json' });
      setPoints(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const LocationFinder = () => {
    const map = useMapEvents({
        click(e) {
            console.log(e.latlng);
            setLatLng(e.latlng)
        },
    });
    return null;
};


function saveNewLoc() {
  console.log("test1");
  const dataToSend = {
    name: document.getElementById("newMarkerLabel").value,
    x: parseFloat(latlng.lat),
    y: parseFloat(latlng.lng)
  };

  console.log("test2");
  console.log(dataToSend);
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
      setLatLng(undefined);
      fetchData();
    })
    .catch(error => {
      // Behandle Fehler hier
      console.error(error);
    });
};


var newMarker;
  if(latlng != undefined){
     newMarker = <Marker position={[latlng.lat, latlng.lng]} icon={defaultIcon}>
        <Popup>
          <input type='text' id="newMarkerLabel"></input>
          <button type="button" onClick={saveNewLoc}>Speichern</button>
        </Popup>
     </Marker>;
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className='buttons'>
      <div className='button-container'>
      <button onClick={openPopup}>New location</button>
      {showPopup && <Save onClose={closePopup} onClick={fetchData()} />}
      </div>
      <div className='button-container'>
      <button onClick={openPopup2}>Calculate Distance</button>
      {showPopup2 && <DistanceCalculator onClose={closePopup2} />}
      </div>
      <div className='button-container'>
      <button onClick={openPopup3}>Table View</button>
      {showPopup3 && <Table onClose={closePopup3} onClick={fetchData()} />}
      </div>
      <div className='button-container'>
      <button onClick={openPopup4}>Radius Calculator</button>
      {showPopup4 && <RadiusCalculator onClose={closePopup4} onClick={fetchData()} />}
      </div>
      </div>
    <MapContainer center={[53.557078, 10.023109]} zoom={13} style={{ height: '700px', width: '100%' }}>
      <LocationFinder />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {newMarker}
      {points.map((point) => (
        <Marker key={point.id} position={[point.latitude, point.longitude]} icon={defaultIcon}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
};

export default Map;