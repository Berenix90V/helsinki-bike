import {Col, Row} from "react-bootstrap";
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

    useEffect(()=>{
        const getNJourneysFrom = async () => {
            return await getNJourneysFromStation(id)
                .then((response) => response.data.njourneys)
                .catch((err)=>err)
        }
        const getNJourneysTo = async () =>{
            return await getNJourneysToStation(id)
                .then((response) => response.data.njourneys)
                .catch((err) => err)
        }
        const getAvgJourneyFromStation = async () => {
            return await avgJourneyFromStation(id)
                .then((response)=> response.data.avg)
                .catch((err)=>err)
        }
        const getAvgJourneyToStation = async () => {
            return await avgJourneyToStation(id)
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
    }, [id])
    return(
        <>
            <Row>
                <Col sm={6}>
                    <p><b>Journeys from station</b></p>
                    <p>{nJourneysFrom}</p>
                    <Row>
                        <p><b>Average distance</b></p>
                        <p>{(avgJourneyFrom/1000).toFixed(2)}</p>
                    </Row>
                    <Row>
                        <p><b>Top 5 Destinations</b></p>
                        <DestinationsTable departure_id={id}/>
                    </Row>

                </Col>
                <Col sm={6}>
                    <p><b>Journeys to station</b></p>
                    <p>{nJourneysTo}</p>
                    <Row>
                        <p><b>Average distance</b></p>
                        <p>{(avgJourneyTo/1000).toFixed(2)}</p>
                    </Row>
                    <Row>
                        <p><b>Top 5 Departures</b></p>
                        <DeparturesTable return_id={id}/>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export {JourneysStats}