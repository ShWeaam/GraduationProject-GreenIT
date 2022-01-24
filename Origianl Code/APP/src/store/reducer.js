import { SET_KEY, GET_KEY } from './actions';
import session from "./session";
import keys from "./keys";

const initialState = {
    isLoggedIn: session.get(keys.isLoggedIn) == 'true' ? true : false,
    language: session.get(keys.language) || "en",
    direction: session.get(keys.direction) || "ltr",
    isLoading: false,
    showLogin: false,
    showSignup: false,
    showResetPassword: false,
    user: session.getParsed(keys.user) || null,
    cookie: session.get(keys.cookie) || ``,
    token: session.get(keys.token) || ``,
    signupSuccessWait: false,
    showPost: null,
    postCreatedRefresh: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_KEY:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };

        case GET_KEY:
            return {
                ...state
            };

        default:
			return state;
    }
}

export default reducer;