import {Table} from "react-bootstrap"
import {useEffect, useState} from "react"
import {Station} from "../interfaces/Station";
import {getAllStations} from "../api/stations_api";

function renderStation(station: Station, index:number){
    return (
        <tr>
            <tr key={index}>
                <td>{station.ID}</td>
                <td>{station.Name}</td>
                <td>{station.City_fi}</td>
                <td>{station.Address_fi}</td>
                <td>{station.Operator}</td>
                <td>{station.Capacity}</td>
            </tr>
        </tr>
    )
}


function StationTable(){
    const[stations, setStations] = useState<Station[]>([])
    useEffect(() => {
        getAllStations()
            .then((response) => {
                setStations(response.data.stations)
            })
    }, [])

    return(
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Operator</th>
                    <th>Capacity</th>
                    <th>x</th>
                    <th>y</th>
                </tr>
            </thead>
            <body>
                {stations.map(renderStation)}
            </body>
        </Table>
    )
}