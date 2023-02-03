import React from 'react';
import RoleContext from "./role-context";


// This provider is intended to be surrounding the whole application.
// It should receive the users permissions as parameter
const RoleProvider = ({roles, children}) => {

    // Creates a method that returns whether the requested permission is available in the list of permissions
    // passed as parameter
    const isAllowedTo = (role) => roles.includes(role);

    // This component will render its children wrapped around a PermissionContext's provider whose
    // value is set to the method defined above
    return <RoleContext.Provider value={{isAllowedTo}}>{children}</RoleContext.Provider>;
};

export default RoleProvider;