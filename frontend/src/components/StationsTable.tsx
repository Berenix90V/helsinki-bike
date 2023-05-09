import {Col, Row, Table} from "react-bootstrap"
import {useEffect, useState} from "react"
import {Station} from "../interfaces/Station";
import {getPaginatedStations} from "../api/stations_api";
import {useNavigate} from "react-router-dom";
import {PageSize} from "./PageSize";
import {TablePagination} from "./TablePagination";


function StationsTable(){
    const[stations, setStations] = useState<Station[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const totalStations = 457
    const navigate = useNavigate()
    useEffect(() => {
        const skip = pageSize*(page-1)
        getPaginatedStations(skip, pageSize)
            .then((response) => {
                setStations(response.data.stations)
            })
    }, [page, pageSize])
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
        <>
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
            <Row>
                <Col>
                    <PageSize pageSize={pageSize} setPageSize={setPageSize}/>
                </Col>
                <Col>
                    <TablePagination page={page} pageSize={pageSize} totalElements={totalStations} setPage={setPage}/>
                </Col>
            </Row>
        </>
    )
}

export {StationsTable}