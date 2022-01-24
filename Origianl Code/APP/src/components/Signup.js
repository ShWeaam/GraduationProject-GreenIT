import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, clearKeys, session} from "../store/actions";
import {connect} from "react-redux";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import utils from '../utils/utils';
import userService from '../services/user';
import NumberFormat from "react-number-format";

function Signup({
                    session,
                    setKey,
                    getKey,
                    clearKeys,
                    ...props
                }) {
    const {i18n} = useTranslation();
    const [name, setName] = useState('');
    const [username, setUsername] = useState(``);
    const [email, setEmail] = useState(``);
    const [password, setPassword] = useState(``);
    const [phone, setPhone] = useState(``);
    const [website, setWebsite] = useState(``);
    const [street, setStreet] = useState(``);
    const [city, setCity] = useState(``);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        clearKeys();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        if (!name || name.length === 0) {
            setErrorMessage(i18n.t('name_required'));
            return;
        }

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
        await userService.signup(name, email, username, password, phone, website, street, city, 2, false)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage('');
                setKey(keys.signupSuccessWait, true);
                setKey(keys.showSignup, false);
            });
    }

    return (
        <>
            <Rodal visible={session.showSignup}
                   onClose={() => setKey(keys.showSignup, false)}
                   closeOnEsc={false}
                   closeMaskOnClick={false}
                   customStyles={utils.rodalBig()}>
                <div className="container-fluid text-center">
                    <img className="img-logo-100 mt-20" src="/logo.png"/>
                    <h4 className="m-4">{i18n.t('signup')}</h4>
                    <div className="row text-left mt-20">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtName">{i18n.t('full_name')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('full_name')} required="required"
                                       id="txtName"
                                       value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtPhone">{i18n.t('phone')}<span className="red">*</span></label>
                                <NumberFormat
                                    placeholder={i18n.t('phone')}
                                    type="tel"
                                    className="form-control"
                                    id="txtPhone" value={phone} onValueChange={values => setPhone(values.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row text-left">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtEmail">{i18n.t('email')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('email')} required="required"
                                       id="txtEmail"
                                       value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtPassword">{i18n.t('password')}<span className="red">*</span></label>
                                <input type="password" className="form-control"
                                       placeholder={i18n.t('password')} required="required"
                                       id="txtPassword"
                                       value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row text-left">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtWebsite">{i18n.t('website')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('website')}
                                       id="txtWebsite"
                                       value={website} onChange={e => setWebsite(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtUsername">{i18n.t('username')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('username')} required="required"
                                       id="txtUsername"
                                       value={username} onChange={e => setUsername(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="row text-left">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="txtStreet">{i18n.t('street')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('street')}
                                       id="txtStreet"
                                       value={street} onChange={e => setStreet(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label>{i18n.t('city')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('city')}
                                       id="txtCity"
                                       value={city} onChange={e => setCity(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        </div>
                    </div>
                    <div className="row mt-20">
                        <div className="col">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmit}>{i18n.t('signup')}</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group text-left">
                                {i18n.t('already_have_account')}
                                <button type="button" className="btn btn-link"
                                        onClick={e => {
                                            setKey(keys.showSignup, false);
                                            setKey(keys.showLogin, true)
                                        }}>{i18n.t('login_here')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Rodal>
        </>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys())
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);