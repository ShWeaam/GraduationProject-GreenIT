import React from 'react';
import {useTranslation} from "react-i18next";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import CompareMetricsBasic from "./CompareMetricsBasic";
import CompareMetricsAdvance from "./CompareMetricsAdvance";

function CompareMetrics({
                     session,
                     setKey,
                     ...props
                 }) {

    const {i18n} = useTranslation();

    return (
        session.user.type === 1 ? <CompareMetricsAdvance /> : <CompareMetricsBasic />
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetrics);