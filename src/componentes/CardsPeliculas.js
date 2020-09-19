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
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import 'animate.css/animate.compat.css'
import sincaratula from '../assets/Sin Caratula.png'

class CardsPeliculas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resultado: [],
            buscador: '',
            loading: false, 
            modalAgregado: false, //Modal que se activa cuando se agrega una Peli a Favoritos
            modalEliminado: false, //Modal que se activa cuando se elimina una Peli de Favoritos
            modalVerPeli: false,
            pelicula: {}
        }

    }


    //Función para actualizar los estados correspondientes
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    /*Función para agregar y eliminar de favoritos */
    agregarFavoritos = (e, peli) => {
        e.preventDefault();
        let duplicado = false; //Variable que indica cuando existe un duplicado en la lista
        let PelisFavo = JSON.parse(localStorage.getItem("PeliculasFav"))

        if (localStorage.getItem("PeliculasFav")) { //Preguntamos si la lista ha sido creada
            PelisFavo.map((p, i) => {
                if (p.imdbID == peli.imdbID) { //Si ya existe la pelicula en la lista
                    PelisFavo.splice(i, 1) //La eliminamos, ya que así funciona nuestro botón de favoritos
                    duplicado = true; //Le avisamos al sistema que ya encontro duplicado

                }
            })
            if (!duplicado) { //Entonces si no hay duplicados agregamos a favoritos
                PelisFavo.push(peli)
                this.toggleAgregar()
            } else {
                this.togglEliminar()
            }
            localStorage.setItem("PeliculasFav", JSON.stringify(PelisFavo))// Guardamos la lista de favoritos
            this.buscar()//Actualizamos la lista

        } else {//Si la lista aún no se crea, agregamos la pelicula e inicializamos la lista
            let PelisFavo = []
            PelisFavo.push(peli);
            localStorage.setItem("PeliculasFav", JSON.stringify(PelisFavo))//Guardamos la lista
            this.buscar()//Actualizamos la lista
            this.toggleAgregar()
        }
    }

    //Función que busca las peliculas por titulo sin mostrar el Loading
    buscar() {
        axios.get('/?apikey=58fd7878&s=' + this.state.buscador).then((res) => {

            this.setState({ resultado: res.data.Search, loading: false })
        }).catch(err =>
            console.log(err))
    }

    //Función que busca las peliculas por titulo mostrando el Loading
    buscarPelicula(e) {
        e.preventDefault();
        this.setState({ loading: true })
        axios.get('/?apikey=58fd7878&s=' + this.state.buscador).then((res) => {
            if (res.data.Error) {
                this.toggleError()
                this.setState({ loading: false })
            }
            setTimeout(() =>

                this.setState({ resultado: res.data.Search, loading: false })
                , 500);

        }).catch(err =>
            console.log(err))

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

    //Función para mostrar la notificación de agregar pelicula a favoritos
    toggleAgregar = () => {
        store.addNotification({
            title: "Genial!",
            message: "¡Película agregada a favoritos!",
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "flipInY"],
            animationOut: ["animated", "flipOutY"],
            dismiss: {
                duration: 2000
            }
        });

    }

    //Función para mostrar la notificación de eliminar pelicula de favoritos
    togglEliminar = () => {
        store.addNotification({
            title: ":(",
            message: "¡Película eliminada de favoritos!",
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

    //Función para mostar la notificación al no encontrar una película
    toggleError = () => {
        store.addNotification({
            title: "Error",
            message: "¡Película no encontrada!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "bounceIn"],
            animationOut: ["animated", "fadeOut"],
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

        const { pelicula, modalVerPeli } = this.state;


        return (
            //Si el sistema está en loading mostramos spinner
            this.state.loading ?
                <div style={{ width: '250px', height: '250px', fontSize: '100px' }} className=" spinner-border text-success" role="status" >
                    <span className="sr-only">Loading...</span>
                </div > :
                <MDBContainer >
                    <MDBRow>
                        {/* Barra de Búsqueda y Botones */}
                        <MDBCol className="text-center">
                            <form onSubmit={(e) => this.buscarPelicula(e)} className="justify-content-center form-inline mt-4 mb-4">
                                <h1></h1>
                                <input style={{ height: '3.1rem', }} onChange={this.handleChange} value={this.state.buscador} id='buscador' className="form-control mb-1 mr-1 mt-4 form-control-lg ml-3 w-20" type="text" placeholder="Título de la Pelicula" />
                                <MDBBtn className="mt-4" style={{ borderRadius: '40px' }} type="submit" color="green" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="search" />
                                    Buscar
                                </MDBBtn>
                                <MDBBtn href="/Favoritos" className="mt-4" style={{ borderRadius: '40px' }} color="amber" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="star" />
                                    Ir a Favoritos
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
                                {this.state.resultado ? this.state.resultado.map((r) =>
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
                                                        <a onClick={(e) => this.agregarFavoritos(e, r)} className="btn-floating   btn-action5    lighten-2 mdb-color waves-effect waves-light">
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


export default CardsPeliculas