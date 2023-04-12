import {Table} from "react-bootstrap";


interface Journey{
    Departure_station: string,
    Return_station: string,
    Covered_distance: number,
    Duration: number
}

function renderJourney(journey:Journey, index:number){
    return (
        <tr key={index}>
            <td>{journey.Departure_station}</td>
            <td>{journey.Return_station}</td>
            <td>{journey.Covered_distance}</td>
            <td>{journey.Duration}</td>
        </tr>
    )
}
function JourneysTable(){
    const journeys: Journey[] = [
        {
            Departure_station: "Kupitta",
            Return_station: "Kupitta",
            Covered_distance: 10.0,
            Duration: 30
        },
        {
            Departure_station: "Student Village",
            Return_station: "Kupitta",
            Covered_distance: 11.0,
            Duration: 43
        }
    ]
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Departure_station_ID</th>
                    <th>Return_station_ID</th>
                    <th>Covered_distance</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                {journeys.map(renderJourney)}
            </tbody>

        </Table>

    )
}

export default JourneysTable