import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Save.css';
import Edit from './Edit';

const Table = ({onClose}) => {
  const [points, setPoints] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(undefined);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/all', { responseType: 'json' });
      setPoints(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    try {
      axios.delete(`http://localhost:8080/api/delete/${id}`).then(fetchData());
      console.log('Delete', id);
    } catch (error) {
    console.log(error);
    }
  };

  const handleEdit = (id) => {
    setSelectedPoint(id);
    openPopup();
  };


  useEffect(() => {
    fetchData();
  }, []);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='popup'>
      <div className='popup-content'>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.name}>
            <td>{point.name}</td>
            <td>{point.latitude}</td>
            <td>{point.longitude}</td>
            <td>
              <button onClick={() => handleEdit(point.name)}>Edit</button>
              {showPopup && <Edit pointId={selectedPoint} onClose={closePopup} onClick={fetchData} />}
              <button onClick={() => handleDelete(point.name)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onClose}>Schließen</button>
    </div>
    </div>
  );
};

export default Table;
