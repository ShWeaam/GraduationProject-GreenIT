import axios from 'axios';
import moment from "moment";

export default class {

    static add = async (token, postId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes`, data,
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

    static check = async (token, postId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes/check`, data,
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

        const data = {
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes/remove`, data,
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
}