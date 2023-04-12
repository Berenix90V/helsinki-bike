import {Nav, Navbar, NavbarBrand} from "react-bootstrap";
import Container from "react-bootstrap/Container";
function NavBar(){
    return (
        <Navbar>
            <Container>
                <NavbarBrand>
                    Helsinki Bikes
                </NavbarBrand>
                <Nav>
                    <Nav.Link>Journeys</Nav.Link>
                    <Nav.Link>Stations</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar