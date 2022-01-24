
import session from './session';

export const SET_KEY = "SET_KEY";
export const GET_KEY = "GET_KEY";
export const CLEAR_KEYS = "CLEAR_KEYS";
export const REMOVE_KEY = "REMOVE_KEY";

export function setKey (key, value) {
    session.set(key, value);
    return {
        type: SET_KEY,
        payload: {
            key: key,
            value: value
        }
    }
}

export function setStringifiedKey(key, value) {
    session.setStringified(key, value);
    return {
        type: SET_KEY,
        payload: {
            key: key,
            value: value
        }
    }
}

export function getKey (key) {
    return {
        type: GET_KEY,
        payload: key
    }
}

export function removeKey (key) {
    session.remove(key);
    return {
        type: REMOVE_KEY,
        payload: key
    }
}

export function clearKeys () {
    session.clear();
    return {
        type: CLEAR_KEYS,
        payload: null
    }
}