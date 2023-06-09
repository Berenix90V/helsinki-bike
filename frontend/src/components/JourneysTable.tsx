import {Table, Row, Col} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Journey} from "../interfaces/Journey";
import {
    countJourneys,
    countJourneysWithDepartureStationStartingWith,
    getPaginatedJourneys,
    getPaginatedJourneysBySearch
} from "../api/journeys_api";
import {TablePagination} from "./TablePagination";
import {PageSize} from "./PageSize";

/**
 * Render Journey's record
 * @param {Journey} journey: single journey object to be rendered
 * @param {number} index: index of journey
 */
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

/**
 * It returns a paginated table of journeys
 *
 */
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
            getPaginatedJourneysBySearch(skip, pageSize, patternFrom, patternTo)
                .then((response) => {
                    setJourneys(response.data.journeys)
                })

    }, [patternFrom, patternTo, page, pageSize])

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th className={"align-top"}>Departure</th>
                    <th className={"align-top"}>Return</th>
                    <th className={"align-top"}>
                        Departure station
                        <p><input onChange={(e)=> {
                            setPage(1)
                            setPatternFrom(e.target.value)
                        }}/></p>
                    </th>
                    <th className={"align-top"}>
                        Return station
                        <p><input onChange={(e)=> {
                            setPage(1)
                            setPatternTo(e.target.value)
                        }}/></p>
                    </th>
                    <th className={"align-top"}>Covered distance (km)</th>
                    <th className={"align-top"}>Duration (min)</th>
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