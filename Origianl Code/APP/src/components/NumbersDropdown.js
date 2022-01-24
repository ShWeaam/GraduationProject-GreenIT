import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import Select from "react-select";
import utils from "../utils/utils";

function NumbersDropdown({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState();

    useEffect(() => {
        let t = [];
        for(let i = props.start; i <= props.end; i++) {
            t.push(i);
        }

        let tmp_arr = [];
        t.forEach(item => {
            tmp_arr.push(<option value={item} key={item}>{item}</option>)
        });

        setOptions(tmp_arr);
        setSelectedOption(props.preselect);
    }, []);

    return (
        <select className="form-control"
                id={props.id}
                value={selectedOption}
                onChange={e => setSelectedOption(e.target.value)}>
            {options}
        </select>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NumbersDropdown);