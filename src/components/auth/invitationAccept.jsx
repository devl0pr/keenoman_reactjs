import React, {useEffect, useState} from "react";

import {setUserInfo} from "../../data/user";
import {Link, useNavigate, useParams} from "react-router-dom";
import instance from "../../config/axios-config";
import FullscreenSpin from "../helpers/fullscreen-spin";

const InvitationAccept = () => {

    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isTokenInProgress, setIsTokenInProgress] = useState(true);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password_repeat: ''
    });

    const [formErrors, setFormErrors] = useState({})
    const {token} = useParams();

    const navigate = useNavigate();
    const errors = {};

    useEffect(() => {
        instance.get('/invite/check/' + token)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    setIsTokenInProgress(false);
                    setIsTokenValid(true);
                }
            })
            .catch(function (error) {
                console.log(error)
                setIsTokenInProgress(false);
            });
    }, []);

    useEffect(() => {
        if(isChanged) {
            setFormErrors(validate(formData));
        }
    }, [formData])

    const onInputChangeHandler = (e) => {
        const {name, value} = e.target
        setFormData(prevState => {
            return {...prevState, [name]: value}
        })

        setIsChanged(true)
    }

    const isValidUsername = (username) => {
        const regex = /^[A-Za-z0-9_-]+$/i;
        return regex.test(username);
    }

    const validate = (formData) => {
        if(!formData.username || !isValidUsername(formData.username)) {
            errors.username = "Invalid username. Only alphanumeric chars."
        } else if (formData.username.length < 3 || formData.username.length > 20) {
            errors.username = "min: 3, max: 20 chars."
        }

        if(!formData.password) {
            errors.password = "Password is empty"
        } else if (formData.password.length < 6) {
            errors.password = "At least 6 chars."
        }

        if(!formData.password_repeat) {
            errors.password_repeat = "Password is empty"
        } else if (formData.password !== formData.password_repeat) {
            errors.password_repeat = "Password is not matching"
        }

        return errors;
    }

    function onsSubmitHandler(e) {
        e.preventDefault()
        setFormErrors(validate(formData));
        if(Object.keys(formErrors).length !== 0 || !formData.password || !formData.password_repeat) {
            return;
        }

        setLoading(true);

        instance.post('/invite/accept/' + token, {'username': formData.username, 'password': formData.password})
            .then(function (response) {
                console.log(response);
                if (response.data.data) {
                    navigate("/")
                }
            })
            .catch(function (error) {
                console.log(error);

                if(error.response.status === 409) {
                    errors.username = "username is already exists";
                }

                setLoading(false)
            });
    }

    if(isTokenInProgress) {
        return <FullscreenSpin />
    }

    return (
        <>
            {
                isTokenValid ?
                <div className="sign section--full-bg"
                     style={{background: "url('../../assets/img/bg.jpg') center center / cover no-repeat"}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="sign__content">
                                    <form action="components/auth/signin#" className="sign__form" onSubmit={onsSubmitHandler}>
                                        <p style={{fontSize: '14px',  color: '#ffffff', padding: '10px 0px 10px 0px'}}>
                                            Type new username and password to accept the invitation
                                        </p>

                                        <div className="sign__group">
                                            <input name="username" type="text" className="sign__input"
                                                   placeholder="Username" onChange={onInputChangeHandler}/>
                                            {formErrors.username && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.username}</p> }
                                        </div>

                                        <div className="sign__group">
                                            <input name="password" type="password" className="sign__input"
                                                   placeholder="Password" onChange={onInputChangeHandler}/>
                                            {formErrors.password && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.password}</p> }
                                        </div>

                                        <div className="sign__group">
                                            <input name="password_repeat" type="password" className="sign__input"
                                                   placeholder="Password Repeat" onChange={onInputChangeHandler}/>
                                            {formErrors.password_repeat && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.password_repeat}</p> }
                                        </div>

                                        {
                                            loading ? <button className="sign__btn" type="button">Please wait</button> : <button className="sign__btn" type="submit" onSubmit={onsSubmitHandler}>Accept</button>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <div className="page-404 section--full-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-404__wrap">
                                        <div className="page-404__content">
                                            <h1 className="page-404__title">404</h1>
                                            <p className="page-404__text">Token is expired.</p>
                                            <Link to="/login" className="page-404__btn">go to login page</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default InvitationAccept