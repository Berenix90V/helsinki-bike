import {Table, Row, Col} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Journey} from "../interfaces/Journey";
import {countJourneys, getPaginatedJourneys} from "../api/journeys_api";
import {TablePagination} from "./TablePagination";
import {PageSize} from "./PageSize";

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
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalJourneys, setTotalJourneys] = useState<number>(0)
    useEffect(() => {
        countJourneys()
            .then((response)=>{
                setTotalJourneys(response.data.count)
            })
    }, [])
    useEffect(() => {
        const skip = pageSize*(page-1)
        getPaginatedJourneys(skip, pageSize)
            .then((response) => {
                setJourneys(response.data.journeys)
            })

    }, [page, pageSize])

    return (
        <>
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
            <Row>
                <Col>
                    <PageSize pageSize={pageSize} setPageSize={setPageSize}/>
                </Col>
                <Col>
                    <TablePagination page={page} pageSize={pageSize} totalElements={totalJourneys} setPage={setPage}/>
                </Col>
            </Row>



        </>


    )
}

export default JourneysTable