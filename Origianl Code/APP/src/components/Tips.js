import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import utils from '../utils/utils';

function Tips({
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
    const [tipsFor, setTipsFor] = useState([]);

    useEffect(() => {
        setTipsFor(props.for || []);
    }, []);

    return (
        <div className="container">
            <div className="row mt-20">
                <div className="col">
                <h2>{i18n.t('tips')}</h2>
                </div>
            </div>
            <div className="row text-left mt-20">
                <div className="col">
                    {
                        tipsFor.includes('water') &&
                            <>
                            <h3>{i18n.t('tips_water')}</h3>
                            <ul>
                                {utils.getTipsForWater(session.language).map(k => <li key={k}>{k}</li> )}
                            </ul>
                            </>
                    }
                </div>
            </div>

            <div className="row text-left mt-20">
                <div className="col">
                    {
                        tipsFor.includes('electricity') &&
                        <>
                            <h3>{i18n.t('tips_electricity')}</h3>
                            <ul>
                                {utils.getTipsForElectricity(session.language).map(k => <li key={k}>{k}</li> )}
                            </ul>
                        </>
                    }
                </div>
            </div>

            <div className="row text-left mt-20">
                <div className="col">
                    {
                        tipsFor.includes('gas') &&
                        <>
                            <h3>{i18n.t('tips_gas')}</h3>
                            <ul>
                                {utils.getTipsForGas(session.language).map(k => <li key={k}>{k}</li> )}
                            </ul>
                        </>
                    }
                </div>
            </div>

            <div className="row text-left mt-20">
                <div className="col">
                    {
                        tipsFor.includes('paper') &&
                        <>
                            <h3>{i18n.t('tips_paper')}</h3>
                            <ul>
                                {utils.getTipsForPaper(session.language).map(k => <li key={k}>{k}</li> )}
                            </ul>
                        </>
                    }
                </div>
            </div>

            <div className="row text-left mt-20">
                <div className="col">
                    {
                        tipsFor.includes('disposables') &&
                        <>
                            <h3>{i18n.t('tips_disposables')}</h3>
                            <ul>
                                {utils.getTipsForDisposables(session.language).map(k => <li key={k}>{k}</li> )}
                            </ul>
                        </>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Tips);