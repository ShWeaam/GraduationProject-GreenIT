import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import userService from '../services/user';
import NumberFormat from 'react-number-format';

function ProfileEdit({
                         session,
                         setKey,
                         setStringifiedKey,
                         getKey,
                         ...props
                     }) {
    const {i18n} = useTranslation();
    const [name, setName] = useState(session.user.name || ``);
    const [phone, setPhone] = useState(session.user.phone || ``);
    const [website, setWebsite] = useState(session.user.website || ``);
    const [street, setStreet] = useState(session.user.street || ``);
    const [city, setCity] = useState(session.user.city || ``);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = async e => {
        e.preventDefault();
        setKey(keys.isLoading, true);
        await userService.update(session.token, name, phone, website, street, city)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage(i18n.t('profile_updated_success'));
                setStringifiedKey(keys.user, result.data);
            });
    }

    const handlePictureUpoad = async e => {
        e.preventDefault();
        if (!e.target.files || !e.target.files[0]) return;
        setKey(keys.isLoading, true);
        await userService.updatePicture(session.token, e.target.files[0])
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage(i18n.t('profile_pic_updated_success'));
                setStringifiedKey(keys.user, result.data);
            });
    }

    return (
        <div className="container">
            <div className="row mt-20">
                <div className="col-sm-3 text-left">
                    <img className="profile-image" src={`${session.user.fileUrl}`}/>
                    <div className="m-2">
                        <label>{i18n.t('upload_new_profile')}</label>
                        <input className="btn-sm" type="file" accept='image/*' onChange={handlePictureUpoad}/>
                    </div>
                </div>
                <div className="col-sm-9">
                    <div className="row mt-20">
                        <h2>{i18n.t('update_profile')}</h2>
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
                                <label htmlFor="txtWebsite">{i18n.t('website')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('website')}
                                       id="txtWebsite"
                                       value={website} onChange={e => setWebsite(e.target.value)}/>
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
                    </div>

                    <div className="row text-left">
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
                            <button type="button" className="btn btn-primary" onClick={handleSave}>{i18n.t('save_changes')}</button>
                        </div>
                    </div>

                    <div className="row mt-20">
                        <div className="col">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        </div>
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
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);