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
    MDBModalBody
} from 'mdbreact'
import Masonry from 'react-masonry-css'
import { store } from 'react-notifications-component';
import sincaratula from '../assets/Sin Caratula.png'

class CardsPeliculasFavoritas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            PelisFav: [], //Estado que recoje las peliculas favoritas del localStorage
            pelicula: {}, //Estado que guarda la película escogida para ver detalles
            modalVerPeli: false //Estado para el modal Ver detalles
        }
    }


    //Función para actualizar el estado
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

    //Función que busca pelicula por id para mostrar en el modal
    buscarPeliculaId = (e, imdbID) => {
        e.preventDefault();
        axios.get('/?apikey=58fd7878&i=' + imdbID).then((res) => {
            this.setState({ pelicula: res.data, loading: false })
            this.toggleVerPeli()
        }).catch(err =>
            console.log(err))
    }

    //Función para mostrar la notificación de eliminar pelicula de favoritos
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

    //Función para mostrar modal con detalles de la película
    toggleVerPeli = () => {
        this.setState({
            modalVerPeli: !this.state.modalVerPeli
        });
    }



    render() {

        //Constante para definir los breakpoint del masonry
        const breakpointColumnsObj = {
            default: 4,
            1100: 3,
            700: 2,
            500: 1
        };

        //variable para indicar si la pelicula se agrega o se elimina de favoritos
        let isFav = false;

        const { PelisFav, pelicula, modalVerPeli } = this.state

        return (
            //Si el sistema está en loading mostramos spinner
            this.state.loading ?
                <div style={{ width: '250px', height: '250px', fontSize: '100px' }} className=" spinner-border text-success" role="status" >
                    <span className="sr-only">Loading...</span>
                </div > :
                <MDBContainer >
                    <MDBRow>
                        {/* Barra de Búsqueda y Botones */}
                        <MDBCol className="text-center ">
                            <form className="justify-content-center form-inline mt-4 mb-4">

                                {PelisFav.length > 0 ?
                                    <h1 className="mr-3">
                                        <MDBIcon className="mr-2" icon="star" />
                                        <strong>Lista de Peliculas Favoritas</strong>
                                    </h1>
                                    :
                                    <h1 style={{ fontSize: '4rem' }} className="mr-3">
                                        <MDBIcon className="mr-2" icon="times" />
                                        <strong>¡Ups! Aca aún no hay nada...</strong>
                                    </h1>
                                }
                                {/* Botón Ir a Buscador*/}
                                <MDBBtn href="/" className="" style={{ borderRadius: '40px' }} color="green" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="search" />
                                    Ir a Buscador
                                </MDBBtn>
                            </form>


                        </MDBCol>
                    </MDBRow>
                    {/* Contenido - Peliculas */}
                    <MDBRow className="">
                        <MDBCol>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {localStorage.getItem("PeliculasFav") ? this.state.PelisFav.map((r) =>
                                    <MDBView hover zoom>
                                        {/* Si no tiene caratula la reemplazamos por una caratula predeterminada*/}
                                        {r.Poster === "N/A" ? <img style={{ width: '100%' }} src={sincaratula} /> :
                                            <img style={{ width: '100%' }} src={r.Poster} />}
                                        {/* Máscara para el hover */}
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
                                                        {/* Preguntamos al localstorage si la pelicula está agregada o no para eliminar o agregar */}
                                                        <a onClick={(e) => this.eliminarDeFavoritos(e, r)} className="btn-floating   btn-action5    lighten-2 mdb-color waves-effect waves-light">
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
                                                {/* Botón Ver más */}
                                                <MDBRow className="mt-2">
                                                    <MDBCol>
                                                        <MDBBtn onClick={(e) => this.buscarPeliculaId(e, r.imdbID)} style={{ borderRadius: '30px' }} color="indigo" >
                                                            <MDBIcon icon="search-plus" size="lg" className="mr-2" />
                                                             Ver más
                                                             </MDBBtn>
                                                    </MDBCol>
                                                </MDBRow>
                                            </MDBContainer>
                                        </MDBMask>
                                    </MDBView>
                                ) : <></>}
                            </Masonry>
                        </MDBCol>
                    </MDBRow>
                    {/* Modal detalle de pelicula */}
                    <MDBModal isOpen={modalVerPeli} toggle={this.toggleVerPeli} size="lg"  >
                        <MDBModalBody style={{ backgroundImage: 'radial-gradient(#424242,#212121,black)' }}>
                            <MDBRow>
                                <MDBCol>
                                    <h3 className="text-center"><strong>{pelicula.Title}</strong></h3>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className=" mt-3">
                                <MDBCol lg="5">
                                    {pelicula.Poster === "N/A" ? <img className="mt-2 mb-4" style={{ width: '100%', borderRadius: '10px' }} src={sincaratula} /> :
                                        <img className="mt-2 mb-4" style={{ borderRadius: '10px' }} src={pelicula.Poster} />}
                                    <p className="ml-1" style={{ fontSize: '15px' }}>
                                        <strong >
                                            <MDBIcon size="lg" icon="clock" className="mr-2" />
                                            {pelicula.Runtime}
                                            <MDBIcon size="lg" fab icon="imdb" className="ml-4 mr-2" />
                                            {pelicula.imdbRating}
                                            <MDBIcon size="lg" icon="vote-yea" className="ml-4 mr-2" />
                                            {pelicula.imdbVotes}
                                        </strong>
                                    </p>
                                </MDBCol>
                                <MDBCol className="text-left" lg="7">
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="bookmark" className="mr-2" />Sinopsis:</strong>{pelicula.Plot}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="users" className="mr-2" />Reparto:</strong>{pelicula.Actors}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="bullhorn" className="mr-2" />Director:</strong>{pelicula.Director}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="book" className="mr-2" />Escritor:</strong>{pelicula.Writer}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="award" className="mr-2" />Premios:</strong>{pelicula.Awards}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="globe-americas" className="mr-2" />País:</strong>{pelicula.Country}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="language" className="mr-2" />Idiomas:</strong>{pelicula.Language}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="video" className="mr-2" />Producción:</strong>{pelicula.Production}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="list-ol" className="mr-2" />Clasificación:</strong>{pelicula.Rated}</p>
                                    <p style={{ fontSize: '15px' }}><strong className="mr-2"><MDBIcon icon="calendar" className="mr-2" />Fecha de Lanzamiento:</strong>{pelicula.Released}</p>

                                </MDBCol>
                            </MDBRow>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
        )
    }
}


export default CardsPeliculasFavoritas