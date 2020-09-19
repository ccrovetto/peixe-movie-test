import React, { Component } from 'react'
import CardsPeliculasFavoritas from '../componentes/CardsPeliculasFavoritas'

class FavList extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <header className="App-header">
                </header>
                <header className="App-content">
                    <CardsPeliculasFavoritas />
                </header>
            </div>
        )
    }
}



export default FavList