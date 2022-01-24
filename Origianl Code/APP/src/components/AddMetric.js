import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';

function AddMetric({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const [water, setWater] = useState(0);
    const [electricity, setElectricity] = useState(0);
    const [gas, setGas] = useState(0);
    const [paper, setPaper] = useState(0);
    const [disposables, setDisposables] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // run the side-effect only once after rendering
    useEffect(() => {
       const metricId = window.location.href.split("/").pop();
       if(metricId && metricId.length === 24) {
           metricService.getById(session.token, metricId)
               .then(result => {
                   if (result.error) {
                       setErrorMessage(result.error);
                       setKey(keys.isLoading, false);
                       return;
                   }

                   setWater(result.data.water || 0);
                   setElectricity(result.data.electricity || 0);
                   setGas(result.data.gas || 0);
                   setPaper(result.data.paper || 0);
                   setDisposables(result.data.disposables || 0);
               });
       }
    }, []);

    const handleSave = async e => {
        e.preventDefault();
        setKey(keys.isLoading, true);
        const metricId = window.location.href.split("/").pop();
        if(metricId && metricId.length === 24) {
            await metricService.update(session.token, metricId, water, electricity, gas, paper, disposables)
                .then(result => {
                    if (result.error) {
                        setErrorMessage(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }

                    setKey(keys.isLoading, false);
                    setErrorMessage('');
                    setSuccessMessage(i18n.t('data_update_success'));
                });
        }
        else {

            metricService.check(session.token)
                .then(result => {
                    if (result.error) {
                        setErrorMessage(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }
                    // check if the metrics have been added this month
                    let status = result.data.status;
                    if(status === true) {
                        setKey(keys.isLoading, false);
                        setSuccessMessage('');
                        setErrorMessage(i18n.t('already_added_for_current_month'));
                    }
                    else {
                        metricService.create(session.token, water, electricity, gas, paper, disposables)
                            .then(result => {
                                if (result.error) {
                                    setErrorMessage(result.error);
                                    setKey(keys.isLoading, false);
                                    return;
                                }

                                setKey(keys.isLoading, false);
                                setErrorMessage('');
                                setSuccessMessage(i18n.t('data_add_success'));
                            });
                    }
                });
        }
    }

    return (
        <div className="container">
            <div className="row mt-20">
                <div className="col">
                <h2>{ window.location.href.split("/").pop().length === 24 ? i18n.t('update_metrics') : i18n.t('add_metrics')}</h2>
                </div>
                <div className="col text-right">
                    <NavLink to="/metrics" className="btn btn-link">{i18n.t('metrics_list')}</NavLink>
                </div>
            </div>
            <div className="row text-left mt-20">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('water')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('water')} required="required"
                               value={water} onChange={e => setWater(parseInt(e.target.value))}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('electricity')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('electricity')} required="required"
                               value={electricity} onChange={e => setElectricity(parseInt(e.target.value))}/>
                    </div>
                </div>
            </div>

            <div className="row text-left">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('gas')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('gas')} required="required"
                               value={gas} onChange={e => setGas(parseInt(e.target.value))}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('paper')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('paper')} required="required"
                               value={paper} onChange={e => setPaper(parseInt(e.target.value))}/>
                    </div>
                </div>
            </div>

            <div className="row text-left">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('disposables')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('disposables')}
                               value={disposables} onChange={e => setDisposables(parseInt(e.target.value))}/>
                    </div>
                </div>
                <div className="col"></div>
            </div>

            <div className="row text-right">
                <div className="col">
                    <button type="button" className="btn btn-primary"
                            onClick={handleSave}>{i18n.t('save_changes')}</button>
                </div>
            </div>

            <div className="row mt-20">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddMetric);