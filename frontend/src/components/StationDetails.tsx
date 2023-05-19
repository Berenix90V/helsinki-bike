import {Station} from "../interfaces/Station";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import { FI, SE } from 'country-flag-icons/react/3x2'

type StationProps = {
    station: Station
}

/**
 * Given  a station it returns station details
 * @param {Station} station: station to be rendered
 *
 */
function StationDetails({station}:StationProps){

    return(
        <>
            <Container fluid>
                <p><b>Name</b></p>
                <Row>
                    <Col sm={6}>
                        <p><FI title="Finland" style={{"height": 16, "margin":10}}/>{station.Name_fi}</p>
                    </Col>
                    <Col sm={6}>
                        <p><SE title="Finland" style={{"height": 16, "margin":10}}/>{station.Name_sw}</p>
                    </Col>
                </Row>
                <p><b>Address</b></p>
                <Row>
                    <Col sm={6}>
                        <p><FI title="Finland" style={{"height": 16, "margin":10}}/>{station.Address_fi}, {station.City_fi}</p>
                    </Col>
                    <Col sm={6}>
                        <p><SE title="Finland" style={{"height": 16, "margin":10}}/>{station.Address_sw}, {station.City_sw}</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default StationDetails