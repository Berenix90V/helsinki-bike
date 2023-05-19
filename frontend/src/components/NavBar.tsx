import {Nav, Navbar, NavbarBrand} from "react-bootstrap";
import Container from "react-bootstrap/Container";

/**
 * Returns the NavBar with link to Journeys and Stations tables
 * 
 */
function NavBar(){
    return (
        <Navbar>
            <Container>
                <NavbarBrand>
                    Helsinki Bikes
                </NavbarBrand>
                <Nav>
                    <Nav.Link href="/journeys">Journeys</Nav.Link>
                    <Nav.Link href="/stations">Stations</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar