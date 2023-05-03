import React from 'react';
import './App.css';
import NavBar from "./components/NavBar";
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {JourneysView} from "./views/JourneysView";
import {StationsView} from "./views/StationsView";


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
                </Routes>
        </BrowserRouter>
    </Container>
  );
}

export default App;
