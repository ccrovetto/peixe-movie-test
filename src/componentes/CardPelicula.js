import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './CardPeli.css'
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBView,
    MDBMask, MDBCard, MDBInput, MDBIcon, MDBBtn
} from 'mdbreact'
import Masonry from 'react-masonry-css'

class CardPelicula extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultado: [],
            buscador: '',
            loading: false
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }



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


    render() {

        const breakpointColumnsObj = {
            default: 4,
            1100: 3,
            700: 2,
            500: 1
        };

        return (
            this.state.loading ?

                <div style={{ width: '100px', height: '100px' }} className=" spinner-border text-success" role="status" >
                    <span className="sr-only">Loading...</span>
                </div > :

                <MDBContainer >
                    <MDBRow>
                        <MDBCol style={{backgroundImage : ''}} className="text-center">
                            <form onSubmit={(e) => this.buscarPelicula(e)} className="justify-content-center form-inline mt-4 mb-4">
                                <MDBIcon icon="search" />
                                <input onChange={this.handleChange} value={this.state.buscador} id='buscador' className="form-control form-control-sm ml-3 w-20" type="text" placeholder="Search" aria-label="Search" />
                                <MDBBtn type="submit" color="green" size="sm">Buscar</MDBBtn>
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
                                                    <MDBCol style={{ paddingTop: '10rem' }} className="text-center">
                                                        <strong className="white-text">{r.Title}</strong>
                                <p>{r.Year}</p>
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