import React, {useState, useEffect} from 'react';
import {Redirect, NavLink} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, clearKeys, session, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import config from '../config.json';
import utils from '../utils/utils';
import userService from '../services/user';
import Cookies from 'universal-cookie';
import SocialButton from './SocialButton';

function Login({
                   session,
                   setKey,
                   setStringifiedKey,
                   getKey,
                   clearKeys,
                   ...props
               }) {
    const {i18n} = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
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
        if (!password || password.length === 0) {
            setErrorMessage(i18n.t('password_required'));
            return;
        }

        setKey(keys.isLoading, true);
        await userService.login(email, password)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage(i18n.t('login_success_redirecting'));

                    const cookies = new Cookies();
                    if (rememberMe)
                        cookies.set(data.cookie, data.token, {path: '/', maxAge: data.age});
                    else
                        cookies.remove(data.cookie);

                    setKey(keys.token, data.token);
                    setKey(keys.isLoading, false);
                    setKey(keys.cookie, data.cookie);
                    setKey(keys.isLoggedIn, true);
                    setStringifiedKey(keys.user, data.user);
                    setKey(keys.showLogin, false);
                    setKey(keys.language, "en");
                }
            });
    }

    return (
        <Rodal visible={session.showLogin}
               onClose={() => setKey(keys.showLogin, false)}
               closeOnEsc={false}
               closeMaskOnClick={false}
               customStyles={utils.rodalSmallVertical()}>
            <div className="container-fluid text-center">
                {redirectTo && <Redirect push to={redirectTo}/>}
                <form onSubmit={handleSubmit}>
                    <img className="img-logo-100 mt-20" src="/logo.png"/>
                    <h4 className="m-4">{i18n.t('login')}</h4>
                    {/*<div className="row">*/}
                    {/*    <div className="col text-center">*/}
                    {/*        <SocialButton*/}
                    {/*            provider='google'*/}
                    {/*            appId='152074463271092'*/}
                    {/*            onLoginSuccess={user => console.log(user)}*/}
                    {/*            onLoginFailure={err => console.log(err)}*/}
                    {/*        >*/}
                    {/*            {i18n.t('login_with_google')}*/}
                    {/*        </SocialButton>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
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
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtPassword">{i18n.t('password')}</label>
                                <input type="password" className="form-control"
                                       placeholder={i18n.t('password')} required="required"
                                       onBlur={e => setErrorMessage(``)} id="txtPassword"
                                       value={password} onChange={e => setPassword(e.target.value)}/>
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
                            <button type="submit" className="btn btn-primary"
                                    onClick={handleSubmit}>{i18n.t('login')}</button>
                            <div className="form-check mt-20">
                                <input type="checkbox" className="form-check-input" name="chkRememberMe"
                                       id="chkRememberMe"
                                       defaultChecked={rememberMe} onClick={e => setRememberMe(e.target.checked)}/>
                                <label className="form-check-label" htmlFor="chkRememberMe">{i18n.t('remember_me')}</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group text-left mt-30">
                                New to {config.appName}?
                                <button type="button" className="btn btn-link" onClick={e => {
                                    setKey(keys.showSignup, true);
                                    setKey(keys.showLogin, false)
                                }}>{i18n.t('signup_here')}
                                </button>
                                <br/>
                                {i18n.t('forgot_password')}
                                <button type="button" className="btn btn-link" onClick={e => {
                                    setKey(keys.showLogin, false);
                                    setKey(keys.showResetPassword, true)
                                }}>{i18n.t('reset_here')}
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
    clearKeys: () => dispatch(clearKeys()),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);