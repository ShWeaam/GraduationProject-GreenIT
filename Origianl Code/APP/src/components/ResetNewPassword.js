import React, {useState, useEffect} from 'react';
import {Redirect, NavLink} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, clearKeys} from "../store/actions";
import {connect} from "react-redux";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import config from '../config.json';
import utils from '../utils/utils';
import userService from '../services/user';

function ResetNewPassword({
                              session,
                              setKey,
                              getKey,
                              clearKeys,
                              ...props
                          }) {
    const {i18n} = useTranslation();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    useEffect(() => {
        clearKeys();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');

        if(!newPassword1 || !newPassword2) {
            setErrorMessage(i18n.t('password_required'));
            return;
        }

        if(newPassword1 !== newPassword2) {
            setErrorMessage(i18n.t('password_doesnt_match'));
            return;
        }

        setKey(keys.isLoading, true);
        await userService.resetPassword(token, newPassword1)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage(i18n.t('password_updated_success'));
            });
    }

    return (
        <div className="container text-left">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <h4 className="mt-30">{i18n.t('reset_your_password')}</h4>
            <div className="row mt-30">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="txtPassword1">{i18n.t('new_password')}<span className="red">*</span></label>
                        <input type="password" className="form-control"
                               placeholder={i18n.t('new_password')} required="required"
                               onBlur={e => setErrorMessage(``)} id="txtPassword1"
                               value={newPassword1} onChange={e => setNewPassword1(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="txtPassword2">{i18n.t('repeat_password')}<span className="red">*</span></label>
                        <input type="password" className="form-control"
                               placeholder={i18n.t('repeat_password')} required="required"
                               onBlur={e => setErrorMessage(``)} id="txtPassword2"
                               value={newPassword2} onChange={e => setNewPassword2(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div className="row text-right">
                <div className="col">
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                        {i18n.t('save_changes')}
                    </button>
                </div>
            </div>

            <div className="row mt-20">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group text-left mt-30">
                        {i18n.t('new')} {config.appName}?
                        <button type="button" className="btn btn-link" onClick={e => {
                            setKey(keys.showResetPassword, false);
                            setKey(keys.showSignup, true)
                        }}>{i18n.t('signup_here')}
                        </button>
                        <br/>
                        {i18n.t('want_to_login')}
                        <button type="button" className="btn btn-link" onClick={e => {
                            setKey(keys.showResetPassword, false);
                            setKey(keys.showLogin, true)
                        }}>{i18n.t('login_here')}
                        </button>
                    </div>
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
    clearKeys: () => dispatch(clearKeys())
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetNewPassword);