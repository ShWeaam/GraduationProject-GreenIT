import axios from 'axios';
import utils from "../utils/utils";
import moment from "moment";

export default class {

    static getByCity = async (token, date) => {
        let result = {
            data: null,
            error: null
        };

        const obj = {date: date};
        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/all`, obj,
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

    static getForComparison = async (token, selectedMetric, selectedUserIds, date) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            metric: selectedMetric,
            userIds: selectedUserIds,
            date: date
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/compare`, data,
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

    static getByUserId = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/user/all`, {},
            { headers: { 'gs_auth': token }})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response && err.response.data || "";
            });

        return result;
    }

    static getUserHistory = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/user/history`, {userId: userId},
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

    static check = async token => {
        let result = {
            data: null,
            error: null
        };

        const data =  {
            date: moment().format()
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/check`, data,
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

    static getAverageByUserId = async token => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/user/average`, {},
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

    static getByUserId2 = async (token, userId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/user-metics/${userId}`, {},
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

    static getByUserId3 = async (token, userId, date) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            userId: userId,
            date: date
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/user-metics-by-month/`, data,
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

        await axios.get(`${process.env.REACT_APP_API_URL}/metrics/${userId}`,
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

    static update = async (token, metricId, water, electricity, gas, paper, disposables) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            water, electricity, gas, paper, disposables
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/${metricId}`, data,
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

    static create = async (token, water, electricity, gas, paper, disposables) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            water, electricity, gas, paper, disposables,
            date: moment().format()
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/metrics/`, data,
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

    static delete = async (token, metricId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/metrics/${metricId}`,
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