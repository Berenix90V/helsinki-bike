import {Col, Row, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {
    avgJourneyFromStation,
    avgJourneyToStation,
    getNJourneysFromStation,
    getNJourneysToStation
} from "../api/journeys_api";
import {DestinationsTable} from "./DestinationsTable";
import {DeparturesTable} from "./DeparturesTable";

type JourneysParameters = {
    id: number
}
function JourneysStats({id}: JourneysParameters){
    const [nJourneysFrom, setNJourneysFrom] = useState<number>(0)
    const [nJourneysTo, setNJourneysTo] = useState<number>(0)
    const [avgJourneyFrom, setAvgJourneyFrom] = useState<number>(0)
    const [avgJourneyTo, setAvgJourneyTo] = useState<number>(0)
    const [month, setMonth] = useState<string>("")

    useEffect(()=>{
        const getNJourneysFrom = async () => {
            return await getNJourneysFromStation(id, month)
                .then((response) => response.data.njourneys)
                .catch((err)=>err)
        }
        const getNJourneysTo = async () =>{
            return await getNJourneysToStation(id, month)
                .then((response) => response.data.njourneys)
                .catch((err) => err)
        }
        const getAvgJourneyFromStation = async () => {
            return await avgJourneyFromStation(id, month)
                .then((response)=> response.data.avg)
                .catch((err)=>err)
        }
        const getAvgJourneyToStation = async () => {
            return await avgJourneyToStation(id, month)
                .then((response)=> response.data.avg)
                .catch((err)=>err)
        }

        getNJourneysFrom()
            .then(setNJourneysFrom)
            .catch((err)=>err)
        getNJourneysTo()
            .then(setNJourneysTo)
            .catch((err)=>err)
        getAvgJourneyFromStation()
            .then(setAvgJourneyFrom)
            .catch((err) => err)
        getAvgJourneyToStation()
            .then(setAvgJourneyTo)
            .catch((err)=>err)
    }, [id, month])
    return(
        <>
            <h3>Journeys from station</h3>
            <Form.Select aria-label="Filter statistics by month" onChange={(el)=>setMonth(el.target.value)}>
                <option value="">Total</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
            </Form.Select>
            <Row>
                <Col>
                    <p><b>Total journeys</b></p>
                    <p>{nJourneysFrom}</p>
                </Col>
                <Col>
                    <p><b>Average distance</b></p>
                    <p>{(avgJourneyFrom/1000).toFixed(2)}</p>
                </Col>
            </Row>
            <Row>
                <p><b>Top 5 Destinations</b></p>
                <DestinationsTable departure_id={id}/>
            </Row>
            <h3>Journeys to station</h3>
            <Row>
                <Col>
                    <p><b>Total journeys</b></p>
                    <p>{nJourneysTo}</p>
                </Col>
                <Col>
                    <p><b>Average distance</b></p>
                    <p>{(avgJourneyTo/1000).toFixed(2)}</p>
                </Col>
            </Row>
            <Row>
                <p><b>Top 5 Departures</b></p>
                <DeparturesTable return_id={id}/>
            </Row>
        </>
    )
}

export {JourneysStats}