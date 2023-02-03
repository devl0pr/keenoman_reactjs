import moment from 'moment'
import 'moment/locale/az'
import React, {useEffect, useState} from 'react'
import {IoChevronBackCircleSharp} from "react-icons/io5";
import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {requestWithToken} from "../../config/axios-config";
import FullscreenSpin from "../helpers/fullscreen-spin";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Comments from "../comment/comments";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";

const MovieDetail = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [movie, setMovie] = useState([]);
    const [isFavorite, setIsFavorite] = useState(null);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const [movieLikeStatus, setMovieLikeStatus] = useState(null);
    const [movieLikeCount, setMovieLikeCount] = useState(null);
    const [movieDislikeCount, setMovieDislikeCount] = useState(null);
    const [likeType, setLikeType] = useState(null);

    const {id} = useParams();
    const navigate = useNavigate();

    moment.locale('az')

    useEffect(() => {
        requestWithToken()
            .get('/movie/' + id)
            .then(function (response) {
                let movie = response.data.data;
                setMovie(movie)
                setMovieLikeCount(movie.like_count);
                setMovieDislikeCount(movie.dislike_count);
                setMovieLikeStatus(movie.me_like_dislike);
                setIsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        if(isFavorite === null) return;

        requestWithToken()
            .post('/movie/favorite/' + id)
            .then(function (response) {
                console.log(response);
                setIsFavoriteLoading(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [isFavorite])

    useEffect(() => {
        if(likeType === null) return;

        requestWithToken()
            .post('/movie/like/' + id + '/' + likeType)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log(error);
            });
    }, [likeType])

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        let string = '';

        if (hours > 0) {
            string += hours + ' h'
        }
        if (minutes > 0) {
            string += ' ' + minutes + ' min'
        }
        return {h: hours, m: minutes, text: string};
    }

    const favoriteClickHandle = (status) => {
        if(isFavoriteLoading) return;

        setIsFavoriteLoading(true)
        setMovie({...movie, is_favorite: status})
        setIsFavorite(status);
    }


    const likeMovieHandle = (status) => {
        if(status > 0) {
            if(movieLikeStatus === 1) {
                setMovieLikeCount(movieLikeCount-1)
                setMovieLikeStatus(0)
                setLikeType(0)
            }
            else if(movieLikeStatus === -1) {
                setMovieDislikeCount(movieDislikeCount-1)
                setMovieLikeCount(movieLikeCount+1)
                setMovieLikeStatus(1)
                setLikeType(1)
            } else {
                setMovieLikeCount(movieLikeCount+1)
                setMovieLikeStatus(1)
                setLikeType(1)
            }
        }
        else if (status < 0) {
            if(movieLikeStatus === 1) {
                setMovieLikeCount(movieLikeCount-1)
                setMovieDislikeCount(movieDislikeCount+1)
                setMovieLikeStatus(-1)
                setLikeType(-1)
            }
            else if(movieLikeStatus === -1) {
                setMovieDislikeCount(movieDislikeCount-1)
                setMovieLikeStatus(0)
                setLikeType(0)
            } else {
                setMovieDislikeCount(movieDislikeCount+1)
                setMovieLikeStatus(-1)
                setLikeType(-1)
            }
        }
    }

    return (
        <>
            {
                isLoading ? <FullscreenSpin/> :
                    <section
                        className="section section--head section--head-fixed section--gradient section--details-bg">
                        <div className="container">
                            <div className="article">
                                <div className="row">
                                    <div className="col-12 col-xl-8">
                                        <div className="article__content">
                                            <h1 style={{alignItems: 'center', display: 'flex'}}><IoChevronBackCircleSharp onClick={() => { navigate(-1) }} style={{ marginRight: '15px', width: '45px', height: 'auto', cursor: 'pointer'}} /> {movie.title}</h1>
                                            <ul className="list">
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                        <path
                                                            d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z"/>
                                                    </svg>
                                                    {movie.imdb}
                                                </li>
                                                <li>
                                                    {
                                                        movie.genres.reduce(function (a, b) {
                                                                return (a.name || a) + ", " + b.name
                                                            }
                                                        )
                                                    }
                                                </li>
                                                <li>{movie.released_year}</li>
                                                <li>{toHoursAndMinutes(movie.duration)['text']}</li>
                                                <li>{movie.rated}</li>
                                            </ul>
                                            <p>{movie.description}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-12" style={{marginTop: '30px'}}>
                                        <iframe width="100%" src={"https://www.youtube.com/embed/" + movie.video_url}
                                                style={{height: 'auto', aspectRatio: '16/9', border: 'none'}}
                                                title="YouTube video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen>

                                        </iframe>
                                        <div className="article__actions article__actions--details">
                                            <button className="article__favorites" type="button">
                                                {
                                                    movie.is_favorite ? <div onClick={() => {favoriteClickHandle(false)}}><FaBookmark /> Remove from favorites</div> :  <div onClick={() => {favoriteClickHandle(true)}}><FaRegBookmark /> Add to favorites </div>
                                                }
                                            </button>

                                            <div>
                                                <button style={{marginRight: '20px'}} onClick={() => {likeMovieHandle(1)}} className="like__btn">
                                                    <span className="likeIcon">{movieLikeStatus === 1 ? <AiFillLike /> :  <AiOutlineLike />}</span>
                                                    <span>{movieLikeCount}</span> Like
                                                </button>

                                                <button onClick={() => {likeMovieHandle(-1)}} className="like__btn dislike__btn">
                                                    <span className="likeIcon">{movieLikeStatus === -1 ? <AiFillDislike /> :  <AiOutlineDislike />}</span>
                                                    <span>{movieDislikeCount}</span> Dislike
                                                </button>
                                            </div>


                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-8">
                                        <div className="categories">
                                            <h3 className="categories__title">Genres</h3>
                                            {
                                                movie.genres.map(genre => {
                                                    return <a key={genre.id} href="components/movie/movieDetail#" className="categories__item">{genre.name}</a>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-xl-12">
                                        <Comments id={id} />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </section>
            }


        </>
    );
}


export default MovieDetail