import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import {swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import {Bar} from 'react-chartjs-2';
import CompareMetricsWithSameCity from "./CompareMetricsWithSameCity";
import CompareMetricsHistory from "./CompareMetricsHistory";

function CompareMetricsBasic({
                                 session,
                                 setKey,
                                 ...props
                             }) {
    const {i18n} = useTranslation();
    const [view, setView] = useState(1);

    return (
        <div className="container my-ads">
            <div className="row mt-20">
                <div className="col">
                    <h3>{i18n.t('compare_metrics')}</h3>
                </div>
                <div className="col text-right">
                    <NavLink to="/metrics-new" className="btn btn-primary">{i18n.t('add_new')}</NavLink>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                               type="radio"
                               name="inlineRadioOptions"
                               id="inlineRadio1"
                               value={1}
                               defaultChecked={true}
                               onClick={() => setView(1)}/>
                        <label className="form-check-label"
                               htmlFor="inlineRadio1">{i18n.t('compare_in_same_city')}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                               type="radio"
                               name="inlineRadioOptions"
                               id="inlineRadio2"
                               value={2}
                               onClick={() => setView(2)}/>
                        <label className="form-check-label" htmlFor="inlineRadio2">{i18n.t('check_history')}</label>
                    </div>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    {
                        view === 1 && <CompareMetricsWithSameCity/>
                    }
                    {
                        view === 2 && <CompareMetricsHistory/>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsBasic);