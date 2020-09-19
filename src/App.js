import React from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import HomePage from '../src/paginas/HomePage'
import FavList from '../src/paginas/FavList'

axios.defaults.baseURL = 'http://www.omdbapi.com';


function App() {
  return (
    <div className="App">
      <ReactNotification />
      <Router>
        <Switch>
        <Route exact component={HomePage} path="/" /> 
        <Route exact component={FavList} path="/Favoritos" /> 
        </Switch>
      </Router>

    </div>
  );
}

export default App;
