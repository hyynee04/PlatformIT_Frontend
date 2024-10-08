import axios from '../utils/axiosCustomize';

const postRegister = (fullName, email, username, password, tin) => {
    return axios.post('api/Authentication/signup', {fullName: fullName, username: username, email: email, password: password, tin: tin})
}

const postLogin = (username, password) => {
    return axios.post('api/Authentication/SignInByPassword', {username, password})
}

export {
    postRegister,
    postLogin,
}