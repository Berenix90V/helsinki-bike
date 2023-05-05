import {Station} from "../interfaces/Station";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";

type StationProps = {
    station: Station
}

function StationDetails({station}:StationProps){

    return(
        <>
            <Container fluid>
                <Row>
                    <Col sm={6}>
                        <p>Nimi</p>
                        <p>{station.Name_fi}</p>
                    </Col>
                    <Col sm={6}>
                        <p>Namn</p>
                        <p>{station.Name_sw}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <p>Osoite</p>
                        <p>{station.Address_fi}</p>
                    </Col>
                    <Col sm={6}>
                        <p>Adress</p>
                        <p>{station.Address_sw}</p>
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export default StationDetails