import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import userService from '../services/user';

function Settings({
                      session,
                      setKey,
                      setStringifiedKey,
                      getKey,
                      ...props
                  }) {
    const {i18n} = useTranslation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    useEffect(() => {
    }, []);

    const handleUpdatePassword = async e => {
        e.preventDefault();
        if(!currentPassword || !newPassword1 || !newPassword2) {
            setErrorMessage(i18n.t('password_required'));
            return;
        }

        if(newPassword1 !== newPassword2) {
            setErrorMessage(i18n.t('password_doesnt_match'));
            return;
        }

        setKey(keys.isLoading, true);
        await userService.updatePassword(session.token, currentPassword, newPassword1)
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
        <div className="container">
            <div className="row mt-20">
                <div className="col-12">
                    <h2>{i18n.t('settings')}</h2>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12 col-md-3">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a className="nav-link active" id="update-password-tab" data-toggle="pill" href="#update-password-tab-content"
                           role="tab" aria-controls="update-password-tab-content" aria-selected="true">{i18n.t('update_password')}</a>
                    </div>
                </div>
                <div className="col-12 col-md-9">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="update-password-tab-content" role="tabpanel"
                             aria-labelledby="update-password-tab">
                            <form onSubmit={handleUpdatePassword}>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="txtPassword">{i18n.t('current_password')}<span className="red">*</span></label>
                                        <input type="password" className="form-control"
                                               placeholder={i18n.t('current_password')} required="required"
                                               onBlur={e => setErrorMessage(``)} id="txtPassword"
                                               value={currentPassword}
                                               onChange={e => setCurrentPassword(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="txtPassword1">{i18n.t('new_password')}<span className="red">*</span></label>
                                        <input type="password" className="form-control"
                                               placeholder={i18n.t('new_password')} required="required"
                                               onBlur={e => setErrorMessage(``)} id="txtPassword1"
                                               value={newPassword1} onChange={e => setNewPassword1(e.target.value)}/>
                                    </div>
                                </div>
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
                                    <button type="button" className="btn btn-primary" onClick={handleUpdatePassword}>
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
                            </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);