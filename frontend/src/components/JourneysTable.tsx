import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Journey} from "../interfaces/Journey";

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