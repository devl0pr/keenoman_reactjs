import {IoChevronBackCircleSharp} from "react-icons/io5";
import React from "react";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {removeUserInfo} from "../../data/user";

const Profile = () => {
    const navigate = useNavigate();

    const logoutClickHandler = (e) => {
        e.preventDefault()
        removeUserInfo()
        window.location.href = '/login'
    }

    return (
        <>
            <section className="section section--head">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-xl-6">
                            <h1 className="section__title section__title--head" style={{alignItems: 'center', display: 'flex'}}><IoChevronBackCircleSharp onClick={() => { navigate(-1) }} style={{ marginRight: '15px', width: '45px', height: 'auto', cursor: 'pointer'}} /> Profile</h1>
                        </div>
                    </div>
                </div>
            </section>
            <div className=" catalog--page">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="profile">

                                <ul className="nav nav-tabs profile__tabs"  >
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/profile" end>Profile</NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/profile/invites" end>Invites</NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <a onClick={logoutClickHandler} className="nav-link" href="#">Logout</a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Profile