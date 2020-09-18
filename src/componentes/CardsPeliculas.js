import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import store2 from 'store'
import 'animate.css/animate.compat.css'

class CardsPeliculas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultado: [],
            buscador: '',
            loading: false,
            modalAgregado: false, //Modal que se activa cuando se agrega una Peli a Favoritos
            modalEliminado: false //Modal que se activa cuando se elimina una Peli de Favoritos

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

        if (PelisFavo) { //Preguntamos si la lista ha sido creada
            PelisFavo.map((p, i) => {
                if (p.imdbID == peli.imdbID) { //Si ya existe la pelicula en la lista
                    PelisFavo.splice(i, 1) //La eliminamos, ya que así funciona nuestro botón de favoritos
                    duplicado = true; //Le avisamos al sistema que ya encontro duplicado
                    
                }
            })
            if (!duplicado) { //Entonces si no hay duplicados agregamos a favoritos
                PelisFavo.push(peli)
                this.toggleAgregar()
            }else{
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
            setTimeout(() =>

                this.setState({ resultado: res.data.Search, loading: false })
                , 500);

        }).catch(err =>
            console.log(err))

    }


    toggleAgregar = () => {

        store.addNotification({
            title: "Genial!",
            message: "¡Pelicula agregada a favoritos!",
            type: "default",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "flipInY"],
            animationOut: ["animated", "flipOutY"],
            dismiss: {
                duration: 2000
            }
        });

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
                        <MDBCol className="text-center">
                            <form onSubmit={(e) => this.buscarPelicula(e)} className="justify-content-center form-inline mt-4 mb-4">
                                <h1></h1>
                                <input style={{ height: '3.1rem', }} onChange={this.handleChange} value={this.state.buscador} id='buscador' className="form-control mb-1 mr-1 mt-4 form-control-lg ml-3 w-20" type="text" placeholder="Título de la Pelicula" />
                                <MDBBtn className="mt-4" style={{ borderRadius: '40px' }} type="submit" color="green" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="search" />
                                    Buscar
                                </MDBBtn>
                                <MDBBtn href="/Favoritos" className="mt-4" style={{ borderRadius: '40px' }} color="indigo" size="lg">
                                    <MDBIcon size="lg" className="mr-2" icon="star" />
                                    Ir a Favoritos
                                </MDBBtn>
                            </form>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="">
                        <MDBCol>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {this.state.resultado ? this.state.resultado.map((r) =>
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
                                                        <a onClick={(e) => this.agregarFavoritos(e, r)} className="btn-floating   btn-action5    lighten-1 mdb-color waves-effect waves-light">
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


export default CardsPeliculas