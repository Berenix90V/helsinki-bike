import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Journey} from "../interfaces/Journey";
import {getAllJourneys} from "../api/journeys_api";

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
        getAllJourneys(10)
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