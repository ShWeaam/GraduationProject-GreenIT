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

function ResetPassword({
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

    useEffect(() => {
        clearKeys();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!email || email.length === 0) {
            setErrorMessage(i18n.t('email_address_required'));
            return;
        } else {
            if (!utils.isValidEmail(email)) {
                setErrorMessage(i18n.t('email_address_valid'));
                return;
            }
        }

        await userService.forgotPassword(email)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage(i18n.t('email_sent'));
                }
            });
    }

    return (
        <Rodal visible={session.showResetPassword}
               onClose={() => setKey(keys.showResetPassword, false)}
               closeOnEsc={false}
               closeMaskOnClick={false}
               customStyles={utils.rodalSmallVertical()}>
            <div className="container-fluid text-center">
                {redirectTo && <Redirect push to={redirectTo}/>}
                <form onSubmit={handleSubmit}>
                    <img className="img-logo-100 mt-20" src="/logo.png"/>
                    <h4 className="m-4">{i18n.t('reset_your_password')}</h4>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtEmail">{i18n.t('email')}</label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('email')} required="required"
                                       onBlur={e => setErrorMessage(``)} id="txtEmail"
                                       value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                {i18n.t('send_reset_link')}
                            </button>
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
                </form>
            </div>
        </Rodal>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys())
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);