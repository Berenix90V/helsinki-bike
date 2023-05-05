import {Col, Row} from "react-bootstrap";

type numberOfJourneys = {
    nJourneysFrom: number,
    nJourneysTo: number
}
function JourneysFromToStation({nJourneysFrom, nJourneysTo}: numberOfJourneys){
    return(
        <>
            <Row>
                <Col sm={6}>
                    <p>Journeys from station</p>
                    <p>{nJourneysFrom}</p>
                </Col>
                <Col sm={6}>
                    <p>Journeys to station</p>
                    <p>{nJourneysTo}</p>
                </Col>
            </Row>
        </>
    )
}

export {JourneysFromToStation}