import React from 'react';
import logo from './logo.svg';
import './App.css';
import JourneysTable from "./components/JourneysTable";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>Journeys table</h1>
      </header>
        <JourneysTable/>
    </div>
  );
}

export default App;
