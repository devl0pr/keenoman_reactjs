import React, {useContext} from "react";

import RoleContext from "./context/Role/role-context";

const Restricted = ({to, fallback, children}) => {

    // We "connect" to the provider thanks to the permission hook
    const {isAllowedTo} = useContext(RoleContext);
    const allowed = isAllowedTo(to);

    // If the user has that permission, render the children
    if(allowed){
        return <>{children}</>;
    }

    // Otherwise, render the fallback
    return <>{fallback}</>;
};

export default Restricted;
