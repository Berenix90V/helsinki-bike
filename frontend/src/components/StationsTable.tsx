import {Table} from "react-bootstrap"
import {useEffect, useState} from "react"
import {Station} from "../interfaces/Station";
import {getAllStations} from "../api/stations_api";
import {useNavigate} from "react-router-dom";


function StationsTable(){
    const[stations, setStations] = useState<Station[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        getAllStations()
            .then((response) => {
                setStations(response.data.stations)
            })
    }, [])
    function RenderStation(station: Station, index:number){

        return (
            <tr key={index} onClick={()=>navigate("/stations/"+station.ID)}>
                <td>{station.ID}</td>
                <td>{station.Name}</td>
                <td>{station.City_fi}</td>
                <td>{station.Address_fi}</td>
                <td>{station.Operator}</td>
                <td>{station.Capacity}</td>
            </tr>
        )
    }

    return(
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Operator</th>
                <th>Capacity</th>
            </tr>
            </thead>
            <tbody>
            {stations.map(RenderStation)}
            </tbody>

        </Table>

    )
}

export {StationsTable}