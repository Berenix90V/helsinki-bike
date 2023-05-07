import React from 'react';
import './App.css';
import NavBar from "./components/NavBar";
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {JourneysView} from "./views/JourneysView";
import {StationsView} from "./views/StationsView";
import SingleStationView from "./views/SingleStationView";


function App() {
  return (
    <Container>
        <BrowserRouter>
          <header className="App-header">
            <NavBar/>
          </header>
                <Routes>
                    <Route path={"/journeys"} element={<JourneysView />}/>
                    <Route path={"/stations"} element={<StationsView/>}/>
                    <Route path={"/stations/:id"} element={<SingleStationView/>}/>
                </Routes>
        </BrowserRouter>
    </Container>
  );
}

// use useParams only in the rendered component https://refine.dev/blog/react-router-useparams/

export default App;
