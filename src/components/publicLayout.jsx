import React, {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {getUserInfo} from "../data/user";

const PublicLayout = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const userInfo = getUserInfo()
        if (userInfo.token) {
            setIsLoggedIn(true)
        }
    }, [])

    return (
        <>
            {
                isLoggedIn ? <Navigate to={"/"} replace={true}/> : <Outlet/>
            }
        </>
    )
};

export default PublicLayout;






