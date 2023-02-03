import {getUserInfo, setUserInfo} from "../../data/user";
import React, {useEffect, useState} from "react";
import instance, {requestWithToken} from "../../config/axios-config";
import moment from "moment/moment";
import Spin from "../helpers/spin";

const ProfileDetails = () => {

    const userInfo = getUserInfo();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
    });

    const [formErrors, setFormErrors] = useState({})
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        if(isChanged) {
            setFormErrors(validate(formData))
        }
    }, [formData])

    const validate = (formData) => {
        const errors = {};

        console.log(formData)

        if(!formData.oldPassword) {
            errors.oldPassword = "Old password is empty"
        } else if (formData.oldPassword.length < 6) {
            errors.newPassword = "At least 6 chars."
        }

        console.log(formData.newPassword)
        if(!formData.newPassword) {
            errors.newPassword = "New password is empty"
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = "At least 6 chars."
        }

        if (formData.repeatPassword !== formData.newPassword) {
            errors.repeatPassword = "Password is not matched"
        }
        console.log(errors)
        return errors;
    }

    const onInputChangeHandler = (e) => {
        const {name, value} = e.target
        setFormData(prevState => {
            return {...prevState, [name]: value}
        })

        setIsChanged(true)
    }

    function onsSubmitHandler(e) {
        e.preventDefault()

        if(Object.keys(formErrors).length !== 0) {
            return
        }

        setLoading(true)

        requestWithToken()
            .put('/person/password', {old_password: formData.oldPassword, password: formData.newPassword})
            .then(function (response) {
                setLoading(false);
                setIsChanged(false);
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: ''
                });
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false)
            });
    }



    return (

        <div className="row">
            <div className="col-12">
                <div className="sign__wrap">
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <form action="components/profile/profileDetails#" className="sign__form sign__form--profile sign__form--first">
                                <div className="row">
                                    <div className="col-12">
                                        <h4 className="sign__title">Profile details</h4>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="username">Info</label>
                                            <input disabled={true} id="username" type="text" name="username" className="sign__input"
                                                   placeholder={userInfo.username} />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="email">Email</label>
                                            <input disabled={true} id="email" type="text" name="email" className="sign__input"
                                                   placeholder={userInfo.email} />
                                        </div>
                                    </div>

                                    {/*<div className="col-12">*/}
                                    {/*    <button className="sign__btn" type="button">Save</button>*/}
                                    {/*</div>*/}
                                </div>
                            </form>
                        </div>

                        <div className="col-12 col-lg-6">
                            <form onSubmit={onsSubmitHandler} className="sign__form sign__form--profile">
                                <div className="row">
                                    <div className="col-12">
                                        <h4 className="sign__title">Change password</h4>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="oldPassword">Old password</label>
                                            <input id="oldPassword" type="password" name="oldPassword" className="sign__input" onChange={onInputChangeHandler} value={formData.oldPassword}/>
                                        </div>
                                        {formErrors.oldPassword && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.oldPassword}</p> }
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="newPassword">New password</label>
                                            <input id="newPassword" type="password" name="newPassword" className="sign__input" onChange={onInputChangeHandler} value={formData.newPassword} />
                                        </div>
                                        {formErrors.newPassword && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.newPassword}</p> }
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="repeatPassword">Confirm new
                                                password</label>
                                            <input id="repeatPassword" type="password" name="repeatPassword"
                                                   className="sign__input" onChange={onInputChangeHandler} value={formData.repeatPassword} />
                                        </div>
                                        {formErrors.repeatPassword && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{formErrors.repeatPassword}</p> }
                                    </div>

                                    <div className="col-12">
                                        <button className="sign__btn" type="submit">{loading ? <Spin /> : 'Change'}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProfileDetails;