export function getUserInfo() {
    return {
        token: localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN),
        username: localStorage.getItem(process.env.REACT_APP_AUTH_USERNAME),
        email: localStorage.getItem(process.env.REACT_APP_AUTH_EMAIL),
        id: localStorage.getItem(process.env.REACT_APP_AUTH_USERID)
    }
}

export function setUserInfo(token, username, email, id) {
    localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN, token)
    localStorage.setItem(process.env.REACT_APP_AUTH_USERNAME, username)
    localStorage.setItem(process.env.REACT_APP_AUTH_EMAIL, email)
    localStorage.setItem(process.env.REACT_APP_AUTH_USERID, id)
}

export function removeUserInfo() {
     localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN)
     localStorage.removeItem(process.env.REACT_APP_AUTH_USERNAME)
     localStorage.removeItem(process.env.REACT_APP_AUTH_EMAIL)
     localStorage.removeItem(process.env.REACT_APP_AUTH_USERID)
}
