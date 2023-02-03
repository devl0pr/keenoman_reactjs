import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';

import FullscreenSpin from "./components/helpers/fullscreen-spin";
import {requestWithToken} from "./config/axios-config";
import RoleProvider from "./context/Role/role-provider";
import {getUserInfo} from "./data/user";
import AccessDenied from "./components/AccessDenied";

const Guard = ({children}) => {
    console.log('guard init')
    const userInfo = getUserInfo()

    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState(['ROLE_ADMIN', 'ROLE_USER'])

    useEffect(() => {
        console.log(userInfo.token)
        if(userInfo.token) {

            // TODO: DELETE IN PROD
            if(roles){
                setIsLoading(false)
                return
            }
            // TODO: END DELETE IN PROD

            requestWithToken()
                .get('/roles')
                .then(function (response) {
                    console.log(response);
                    setRoles(response.data.data.roles)
                    setIsLoading(false)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [])


    return (
        <>
            {
                userInfo.token ?
                    isLoading ? <FullscreenSpin/> : (roles.length > 0 ? <RoleProvider roles={roles}>{children}</RoleProvider> :
                        <AccessDenied />)
                    : <Navigate to={"/login"} replace={true} />
            }
        </>
    );
};

export default Guard;






