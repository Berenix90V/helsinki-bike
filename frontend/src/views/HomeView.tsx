import React from "react";
import Container from "react-bootstrap/Container";
import {ListGroup, ListGroupItem} from "react-bootstrap";

function HomeView (){
    return(
        <>
            <Container>
                <h1 className="text-center">Welcome to Helsinki Bikes App</h1>
                <ListGroup>
                    <ListGroupItem variant={"light"}> If you want to visualize the journeys' list click on Journeys</ListGroupItem>
                    <ListGroupItem variant={"light"}> If you want to visualize the stations' list click on Stations</ListGroupItem>
                    <ListGroupItem variant={"light"}> To visualize a single station view click on Stations, search the station and click on the corresponding row</ListGroupItem>
                </ListGroup>
            </Container>

        </>
    )
}

export {HomeView}