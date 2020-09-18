import React, { Component } from 'react'
import CardsPeliculas from '../componentes/CardsPeliculas'
import '../App.css';
class HomePage extends Component {

    render() {
        return (
            <div>
                <header className="App-header">
                </header>
                <header className="App-content">
                    <CardsPeliculas />

                </header>
            </div>
        )
    }
}


export default HomePage