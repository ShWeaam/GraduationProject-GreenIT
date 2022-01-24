import axios from 'axios';
import utils from "../utils/utils";
import moment from "moment";

export default class {

    static getAllUsers = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/all-users`, {},
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }
    static getAll = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/all`, {},
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static getSignupRequests = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/signup-requests`, {},
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static getById = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`,
        { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static login = async (email, password) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            email: email,
            password: password
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static forgotPassword = async email => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            email: email
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/forgot-password`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static resetPassword = async (token, password) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            token: token,
            password: password
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/reset-password`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static activateAccount = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };

        const data = { userId: userId };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/activate`, data,
        { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static deleteAccount = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/delete/${userId}`,
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static signup = async (name, email, username, password, phone, website, street, city, type, active) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            name, email, username, password, phone, website, street, city, type, active,
            joined: moment().format()
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/signup`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePassword = async (token, currentPassword, newPassword) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            currentPassword,
            newPassword
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/update-password`, data,
            { headers: { 'gs_auth': token } })
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePicture = async str => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            picture: str
        };

        // await axios.post(`${process.env.REACT_APP_API_URL}/users/upic/${session.get('user')._id}`, data)
        //     .then(resp => {
        //         if (resp.status === 200) {
        //             result.data = resp.data;
        //         }
        //     })
        //     .catch(err => {
        //         result.error = err.response.data;
        //     });

        return result;
    }

    static update = async (token, name, phone, website, street, city) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            name, phone, website, street, city
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/update`, data,
            { headers: { 'gs_auth': token } })
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static add = async (token, name, email, username, password, phone, website, street, city, type, active) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            name, email, username, password, phone, website, street, city, type, active,
            joined: moment().format()
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/add-supervisor`, data,
            { headers: { 'gs_auth': token } })
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updateLocation = async (token, lat, lng) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            coordinates: [lat, lng]
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/users/update-location`, data,
            { headers: { 'gs_auth': token } })
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePicture = async (token, file) => {
        let result = {
            data: null,
            error: null
        };

        const fd = new FormData();
        fd.append("file", file);

        await axios.post(`${process.env.REACT_APP_API_URL}/users/update-picture`, fd,
            { headers: { 'gs_auth': token } })
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static delete = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/users/me`,
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }
}