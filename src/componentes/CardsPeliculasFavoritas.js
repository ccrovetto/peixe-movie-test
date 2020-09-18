import React, { Component } from 'react'
import axios from 'axios'
import './CardPeli.css'
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBView,
    MDBMask,
    MDBIcon,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBNotification
} from 'mdbreact'
import Masonry from 'react-masonry-css'
import { store } from 'react-notifications-component';


class CardsPeliculasFavoritas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            PelisFav: []

        }

    }



    actualizarLista() {
        this.setState({ PelisFav: JSON.parse(localStorage.getItem("PeliculasFav")) })
    }

    componentDidMount() {
        this.actualizarLista()
    }

    /*Función para agregar y eliminar de favoritos */
    eliminarDeFavoritos = (e, peli) => {
        e.preventDefault();
        let duplicado = false; //Variable que indica cuando existe un duplicado en la lista
        let PelisFavo = JSON.parse(localStorage.getItem("PeliculasFav"))

        if (PelisFavo) { //Preguntamos si la lista ha sido creada
            PelisFavo.map((p, i) => {
                if (p.imdbID == peli.imdbID) { //Si ya existe la pelicula en la lista
                    PelisFavo.splice(i, 1) //La eliminamos, ya que así funciona nuestro botón de favoritos
                    this.actualizarLista()
                    this.togglEliminar()

                }
            })
            localStorage.setItem("PeliculasFav", JSON.stringify(PelisFavo))// Guardamos la lista de favoritos
            this.setState({ PelisFav: PelisFavo })
        }
    }

    togglEliminar = () => {
        store.addNotification({
            title: ":(",
            message: "¡Pelicula eliminada de favoritos!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "flipInY"],
            animationOut: ["animated", "flipOutY"],
            dismiss: {
                duration: 2000

            }
        });
    }



    render() {

        const breakpointColumnsObj = {
            default: 4,
            1100: 3,
            700: 2,
            500: 1
        };

        let isFav = false;

        return (
            this.state.loading ?
                <div style={{ width: '250px', height: '250px', fontSize: '100px' }} className=" spinner-border text-success" role="status" >
                    <span className="sr-only">Loading...</span>
                </div > :
                <MDBContainer >
                    <MDBRow>
                        <MDBCol className="text-center ">
                            <form className="justify-content-center form-inline mt-4 mb-4">

                                {this.state.PelisFav.length > 0 ?
                                    <h1 className="mr-3">
                                        <MDBIcon className="mr-2" icon="star" />
                                        <strong>Lista de Peliculas Favoritas</strong>
                                    </h1>
                                    :
                                    <h1 style={{fontSize:'4rem'}} className="mr-3">
                                        <MDBIcon className="mr-2" icon="times" />
                                        <strong>¡Ups! Aca aún no hay nada...</strong>
                                    </h1>
                                }



                                <MDBBtn href="/" className="" style={{ borderRadius: '40px' }} color="green" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="search" />
                                    Ir a Buscador
                                </MDBBtn>
                            </form>


                        </MDBCol>
                    </MDBRow><MDBRow className="">
                        <MDBCol>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {localStorage.getItem("PeliculasFav") ? this.state.PelisFav.map((r) =>
                                    <MDBView hover zoom>
                                        <img style={{ width: '100%' }} src={r.Poster} />
                                        <MDBMask overlay="black-strong">
                                            <MDBContainer>
                                                <MDBRow>
                                                    <MDBCol className="mt-3 text-center">
                                                        <strong className="white-text">{r.Title}</strong>
                                                        <p>{r.Year}</p>
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow>
                                                    <MDBCol className="text-center">
                                                        <a onClick={(e) => this.eliminarDeFavoritos(e, r)} className="btn-floating   btn-action5    lighten-1 mdb-color waves-effect waves-light">
                                                            {
                                                                localStorage.getItem("PeliculasFav") ?
                                                                    JSON.parse(localStorage.getItem("PeliculasFav")).map(p => {
                                                                        if (p.Title == r.Title) {
                                                                            return (<MDBIcon size="lg" icon="star" />)
                                                                            isFav = true;
                                                                        }

                                                                    })
                                                                    : <></>
                                                            }
                                                            {
                                                                isFav ? <></> : <MDBIcon far size="lg" icon="star" />
                                                            }
                                                        </a>
                                                    </MDBCol>
                                                </MDBRow>
                                            </MDBContainer>
                                        </MDBMask>
                                    </MDBView>
                                ) : <></>}
                            </Masonry>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
        )
    }
}


export default CardsPeliculasFavoritas