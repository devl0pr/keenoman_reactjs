import React from 'react';
import Footer from "./main/footer";

import {Outlet} from "react-router-dom";
import Header from "./main/header";


const PrivateLayout = () => {

    return (
        <>
            <Header/>
            <Outlet />
            <Footer/>
        </>
    )
};

export default PrivateLayout;