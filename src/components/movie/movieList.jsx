import React, {useEffect, useState} from "react";
import {requestWithToken} from "../../config/axios-config";
import {useNavigate, useSearchParams} from "react-router-dom";
import FullscreenSpin from "../helpers/fullscreen-spin";
import MovieCard from "./movieCard";
import ReactPaginate from "react-paginate";
import Filters from "../main/filters";
import PrevIcon from "../icons/prev";
import NextIcon from "../icons/next";

const MovieList = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [movies, setMovies] = useState([])
    const [moviesCount, setMoviesCount] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') ?? 1)
    const [genre, setGenre] = useState(searchParams.get('genre') ? searchParams.get('genre')[0] : '')

    useEffect(() => {
        setIsLoading(true);
        requestWithToken()
            .get('/movie?page=' + page + (genre ? '&genre[]=' + genre : ''))
            .then(function (response) {
                console.log(response);
                setMovies(response.data.data);
                setMoviesCount(response.data.count);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [page, genre])

    const handlePageClick = (event) => {
        const page = event.selected+1;
        setSearchParams({'page': page});
        setIsLoading(true);
        setPage(page);
    };

    return (
        <>
            <Filters genre={genre} setGenre={setGenre} searchParams={searchParams} setSearchParams={setSearchParams} />
            {
                isLoading ? <FullscreenSpin/> :
                    <div className="row row--grid">
                        {
                            movies.map((movie) => {
                                return (
                                    <div className="col-6 col-sm-4 col-lg-3 col-xl-2" key={movie.id}>
                                        <MovieCard movie={movie}  />
                                    </div>
                                )
                            })
                        }
                    </div>
            }

            <div className="row">
                <div className="col-12">
                    <ReactPaginate
                        containerClassName="catalog__paginator"
                        previousLabel={<PrevIcon />}
                        nextLabel={<NextIcon />}
                        pageClassName=""
                        pageLinkClassName=""
                        previousClassName=""
                        previousLinkClassName=""
                        nextClassName=""
                        nextLinkClassName=""
                        breakLabel="..."
                        breakClassName=""
                        breakLinkClassName=""
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        activeClassName="active"
                        onPageChange={handlePageClick}
                        pageCount={Math.ceil(moviesCount / 20)}
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </>
    )
}

export default MovieList