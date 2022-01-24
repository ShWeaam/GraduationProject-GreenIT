import axios from 'axios';
import moment from "moment";

export default class {

    static add = async (token, postId, text) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            text: text,
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/comments`, data,
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