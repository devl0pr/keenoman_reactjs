import {useEffect, useState} from "react";
import Select from 'react-select'
import {requestWithToken} from "../../config/axios-config";

const Filters = ({setGenre, genre, searchParams, setSearchParams}) => {

    const [genres, setGenres] = useState([]);
    const [defaultGenre, setDefaultGenre] = useState(null);

    useEffect(() => {

        requestWithToken()
            .get('/genre')
                .then(function (response) {
                    console.log(response);
                    const options = [];
                    response.data.data.map(g => {
                        let obj = {value: g.id, label: g.name};

                        if(parseInt(genre) === g.id) {
                            setDefaultGenre(obj)
                        }

                        options.push(obj)
                    })
                    setGenres(options)
                })
                .catch(function (error) {
                    console.log(error);
                })
    }, [])

    const indicatorSeparatorStyle = {
        alignSelf: 'stretch',
        marginBottom: 8,
        marginTop: 8,
        width: 1,
    };

    const IndicatorSeparator = ({innerProps}) => {
        return <span style={indicatorSeparatorStyle} {...innerProps} />;
    };

    function onGenreFilterChange(option) {
        console.log(option)
        let value = ''

        if(option){
            value = option.value
            searchParams.set('genre', value);
        } else {
            searchParams.delete('genre')
        }

        setSearchParams(searchParams)
        setGenre(value)
    }

    return (

        <div className="catalog__nav">

            <div className="catalog__select-wrap">
                {genres.length > 0 && <Select
                    defaultValue={defaultGenre}
                    placeholder={"Filter by genre"}
                    onChange={onGenreFilterChange}
                    isClearable={true}
                    components={{ IndicatorSeparator }}
                    options={genres}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            "&:hover": {
                                borderColor: "#455879",
                            },
                            boxShadow: state.isFocused ? '0 0 0 1px #455879' : '0 0 0 1px #151f30',
                            backgroundColor: '#151f30',
                            borderColor: '#151f30',
                            color: '#ffffff',
                            width: '200px',
                            marginRight: '20px'
                        }),
                        placeholder: (baseStyles, state) => ({
                            ...baseStyles,
                            color: '#fff',
                            fontSize: '14px'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            padding: 5,
                            borderRadius: 5,
                            color: 'white',
                            display: 'flex',
                        }),
                    }}
                />}

            </div>

            {/*<div className="slider-radio">*/}
            {/*    <input type="radio" name="grade" id="featured" checked="checked" />*/}
            {/*    <label htmlFor="featured">Featured</label>*/}

            {/*    <input type="radio" name="grade" id="popular" />*/}
            {/*    <label htmlFor="popular">Popular</label>*/}

            {/*    <input type="radio" name="grade" id="newest" />*/}
            {/*    <label htmlFor="newest">Newest</label>*/}
            {/*</div>*/}
        </div>
    )
}

export default Filters