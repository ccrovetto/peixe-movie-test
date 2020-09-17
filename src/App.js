import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import CardPelicula from './componentes/CardPelicula'

axios.defaults.baseURL = 'http://www.omdbapi.com';


function App() {
  return (
    <div className="App">
      <header className="App-header">
       
        
      </header>
      <header className="App-content">
      <CardPelicula/>
        
      </header>
      
    </div>
  );
}

export default App;
