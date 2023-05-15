import {Table, Row, Col} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Journey} from "../interfaces/Journey";
import {
    countJourneys,
    countJourneysWithDepartureStationStartingWith,
    getPaginatedJourneys,
    getPaginatedJourneysByDepartureStation
} from "../api/journeys_api";
import {TablePagination} from "./TablePagination";
import {PageSize} from "./PageSize";

function renderJourney(journey:Journey, index:number){
    return (
        <tr key={index}>
            <td>{journey.Departure_datetime.replace("T", " ").replace(".000Z", "")}</td>
            <td>{journey.Return_datetime.replace("T", " ").replace(".000Z", "")}</td>
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
    const [patternFrom, setPatternFrom] = useState<string>("")
    const [patternTo, setPatternTo] = useState<string>("")
    useEffect(() => {
        if(patternFrom ==="" && patternTo==="")
            countJourneys()
                .then((response)=>{
                    setTotalJourneys(response.data.count)
                })
        else
            countJourneysWithDepartureStationStartingWith(patternFrom, patternTo)
                .then((response)=>{
                    setTotalJourneys(response.data.count)
                })
    }, [patternFrom, patternTo])
    useEffect(() => {
        const skip = pageSize*(page-1)
        if(patternFrom===""  && patternTo==="")
            getPaginatedJourneys(skip, pageSize)
                .then((response) => {
                    setJourneys(response.data.journeys)
                })
        else
            getPaginatedJourneysByDepartureStation(skip, pageSize, patternFrom, patternTo)
                .then((response) => {
                    setJourneys(response.data.journeys)
                })

    }, [patternFrom, patternTo, page, pageSize])

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Departure</th>
                    <th>Return</th>
                    <th>
                        Departure station
                        <p><input onChange={(e)=>setPatternFrom(e.target.value)}/></p>
                    </th>
                    <th >
                        Return station
                        <p><input onChange={(e)=>setPatternTo(e.target.value)}/></p>
                    </th>
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