import React from 'react';
import './App.css';
import JourneysTable from "./components/JourneysTable";
import NavBar from "./components/NavBar";
import Container from 'react-bootstrap/Container';


function App() {
  return (
    <Container>
      <header className="App-header">
        <NavBar/>
      </header>
        <h1 className="text-center">Journeys table</h1>
        <JourneysTable/>
    </Container>
  );
}

export default App;
