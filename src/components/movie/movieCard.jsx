import PlayIcon from '../icons/play';
import StarIcon from '../icons/star';
import {Link} from "react-router-dom";

const MovieCard = ({movie}) => {
    return (
        <div className="card">
            <Link className="card__cover" to={'movie/' + movie.id}>
                <img style={{aspectRatio: '2/2.85'}} src={movie.thumbnail_url} alt=""/>
                <PlayIcon />
            </Link>

            {/*<button className="card__add" type="button">*/}
            {/*    <BookmarkIcon />*/}
            {/*</button>*/}

            <span className="card__rating">
                <StarIcon /> {movie.imdb}
            </span>

            <h3 className="card__title">
                <Link to={'movie/' + movie.id}>{movie.title}</Link>
            </h3>

            <ul className="card__list">
                {
                    movie.genres.map(genre => {
                        return (
                            <li key={genre.id}>{genre.name}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}


export default MovieCard