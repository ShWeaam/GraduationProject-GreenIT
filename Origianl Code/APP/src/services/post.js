import axios from 'axios';
import utils from "../utils/utils";
import moment from "moment";

export default class {

    static getAll = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/all`, {},
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

    static getByUserId = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/user/${userId}`, {},
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

    static getMine = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/get-mine`, {},
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

    static getById = async (token, postId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`,
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

    static update = async (token, postId, text, file, hashtags) => {
        let result = {
            data: null,
            error: null
        };

        const fd = new FormData();
        fd.append("text", text);
        fd.append("file", file);
        fd.append("hashtags", hashtags);

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/update/${postId}`, fd,
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

    static create = async (token, text, file, hashtags) => {
        let result = {
            data: null,
            error: null
        };

        const fd = new FormData();
        fd.append("text", text);
        fd.append("file", file);
        fd.append("hashtags", hashtags);
        fd.append("date", moment().format());

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/`, fd,
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

    static delete = async (token, postId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`,
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

    static share = async (token, postId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/share/${postId}`, {date: moment().format()},
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