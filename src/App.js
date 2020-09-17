import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import CardPelicula from './componentes/CardPelicula'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

axios.defaults.baseURL = 'http://www.omdbapi.com';


function App() {
  return (
    <div className="App">
      <ReactNotification />
      <header className="App-header">
       
        
      </header>
      <header className="App-content">
      <CardPelicula/>
        
      </header>
      
    </div>
  );
}

export default App;
