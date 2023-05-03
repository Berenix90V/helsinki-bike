import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";

interface Station{
    ID:number,
    Name_fi: string,
    Name_sw: string,
    Name: string,
    Address_fi: string,
    Address_sw: string,
    City_fi: string,
    City_sw: string,
    Operator: string,
    Capacity: number,
    x: number,
    y: number
}

interface Journey{
    Departure_station: Station,
    Return_station: Station,
    Covered_distance: number,
    Duration: number
}

function renderJourney(journey:Journey, index:number){
    return (
        <tr key={index}>
            <td>{journey.Departure_station.Name}</td>
            <td>{journey.Return_station.Name}</td>
            <td>{(journey.Covered_distance/1000.0).toFixed(2)}</td>
            <td>{(journey.Duration/60.0).toFixed(2)}</td>
        </tr>
    )
}
function JourneysTable(){
    const [journeys, setJourneys] = useState<Journey[]>([])
    useEffect(() => {
        axios.get("http://localhost:3006/api/v1/journeys/?take=10")
            .then((response) => {
                setJourneys(response.data.journeys)
            })
    }, [])

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Departure station</th>
                    <th>Return station</th>
                    <th>Covered distance (km)</th>
                    <th>Duration (min)</th>
                </tr>
            </thead>
            <tbody>
                {journeys.map(renderJourney)}
            </tbody>

        </Table>

    )
}

export default JourneysTable