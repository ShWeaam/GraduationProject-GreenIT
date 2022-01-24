import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import userService from '../services/user';
import NumberFormat from 'react-number-format';

function AddSupervisor({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
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

    const handleSave = async e => {
        e.preventDefault();
        setKey(keys.isLoading, true);
        await userService.add(session.token, name, email, username, password, phone, website, street, city, 1, true)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage(i18n.t('supervisor_add_success'));
            });
    }

    return (
        <div className="container">
            <div className="row mt-20">
                <div className="col">
                <h2>{i18n.t('add_supervisor')}</h2>
                </div>
                <div className="col text-right">
                    <NavLink to="/supervisors" className="btn btn-link">{i18n.t('add_new')}</NavLink>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddSupervisor);