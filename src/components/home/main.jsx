import MovieList from "../movie/movieList";

const Main = () => {
    return (
        <>
            <div className="catalog">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <MovieList/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main