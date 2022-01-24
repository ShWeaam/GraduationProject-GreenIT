import axios from 'axios';
import utils from "../utils/utils";
import moment from "moment";

export default class {

    static getAll = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/orgs/all`, {},
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

    static create = async (token, obj) => {
        let result = {
            data: null,
            error: null
        };

        const fd = new FormData();
        fd.append("joined", moment().format());
        for (const [key, value] of Object.entries(obj)) {
            fd.append(key, value);
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/orgs/`, fd,
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

    static delete = async (token, orgId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/orgs/${orgId}`,
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