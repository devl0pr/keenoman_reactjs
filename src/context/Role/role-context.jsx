import React from "react";

const RoleContext = React.createContext({
    isAllowedTo: (role) => false
})

export default RoleContext;