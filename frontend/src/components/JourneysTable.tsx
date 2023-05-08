import {Pagination, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Journey} from "../interfaces/Journey";
import {getPaginatedJourneys} from "../api/journeys_api";

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
    const totalJourneys = 3126264
    useEffect(() => {
        const skip = pageSize*(page-1)
        getPaginatedJourneys(skip, pageSize)
            .then((response) => {
                setJourneys(response.data.journeys)
            })

    }, [page, pageSize])
    const items = [1,2,3,4,5]

    function renderPaginationItems(item: number){
        return(
            <Pagination.Item key={item} active={item==page} onClick={()=>setPage(item)}>{item}</Pagination.Item>
        )
    }

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
            <Pagination>
                {items.map(renderPaginationItems)}
            </Pagination>
        </>


    )
}

export default JourneysTable