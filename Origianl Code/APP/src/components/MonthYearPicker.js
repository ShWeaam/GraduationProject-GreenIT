import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import Select from "react-select";
import utils from "../utils/utils";
import NumbersDropdown from "./NumbersDropdown";
import moment from "moment";

function MonthYearPicker({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const now = moment();

    return (
        <div className="row">
            <div className="col">
                <NumbersDropdown
                    id="ddl-month"
                    start={1}
                    end={12}
                    preselect={now.month()+1}
                />
            </div>
            <div className="col">
                <NumbersDropdown
                    id="ddl-year"
                    start={moment().add(-10, 'years').year()}
                    end={now.year()}
                    preselect={now.year()}
                />
            </div>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MonthYearPicker);