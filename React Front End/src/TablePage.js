import React from "react";
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Table from "./Components/Table.js"


const TablePage = ({data}) => {
const [point, setpoint] = useState([]);

useEffect(() => {
    axios.get('http://localhost:8080/api/all')
    .then(response => {
        const data = response.data;
        setpoint(data);
    })
    .catch(error => {
        console.error('Fehler beim Laden der Orte:', error);
    });
}, []);

const columns = useMemo(
    () => [
      {
        Header: "Namen",
        accessor: "name",
      },
      {
        Header: "Längengrad",
        accessor: "point.x",
      },
      {
        Header: "Breitengrad",
        accessor: "point.y",
      },
    ],
    []
  );

return (
    <div>
        <Table columns={columns} data={point}/>
    </div>
);
};


export default TablePage;