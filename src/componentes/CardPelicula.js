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



class CardPelicula extends Component {
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
    agregarFavoritos(e, peli) {
        //Si la pelicula ya se encuentra agregada, la eliminamos
        if (localStorage.getItem(peli.Title)) {
            localStorage.removeItem(peli.Title)
            this.togglEliminar()
            this.buscar()

            //Si la pelicula no está agregada, la agregamos
        } else {
            localStorage.setItem(peli.Title, peli.imdbID)
            this.toggleAgregar()
            this.buscar()
           
        }
    }

    //Función que busca las peliculas por titulo sin mostrar el Loading
    buscar() {
        axios.get('/?apikey=58fd7878&s=' + this.state.buscador).then((res) => {
            console.log(res.data)
            this.setState({ resultado: res.data.Search, loading: false })
        }).catch(err =>
            console.log(err))
    }

    //Función que busca las peliculas por titulo mostrando el Loading
    buscarPelicula(e) {
        e.preventDefault();
        this.setState({ loading: true })
        axios.get('/?apikey=58fd7878&s=' + this.state.buscador).then((res) => {
            console.log(res.data)
            setTimeout(() =>

                this.setState({ resultado: res.data.Search, loading: false })
                , 500);

        }).catch(err =>
            console.log(err))

    }


    toggleAgregar = () => {

        store.addNotification({
            title: "Wonderful!",
            message: "¡Pelicula agregada a favoritos!",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
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
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
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
                                <MDBBtn className="mt-4" style={{ borderRadius: '40px' }} color="indigo" size="lg">
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
                                                        <a onClick={(e) => this.agregarFavoritos(e, r)} className="btn-floating   btn-action5    lighten-1 mdb-color waves-effect waves-light">{localStorage.getItem(r.Title) ? <MDBIcon size="lg" icon="star" /> : <MDBIcon far size="lg" icon="star" />}</a>
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

CardPelicula.propTypes = {

}

export default CardPelicula