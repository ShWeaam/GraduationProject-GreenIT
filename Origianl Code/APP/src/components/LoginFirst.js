import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, session} from "../store/actions";
import {connect} from "react-redux";

function LoginFirst({
                   session,
                   setKey,
                   ...props
               }) {

    const {i18n} = useTranslation();

    return (
        <div className="container-fluid home">
            <div className="row">
                <div className="col">
                    {i18n.t('login_first')}
                    <NavLink className="btn btn-link" to="#" onClick={() => setKey(keys.showSignup, true)}>{i18n.t('signup')}</NavLink>
                    <NavLink className="btn btn-link" to="#" onClick={() => setKey(keys.showLogin, true)}>{i18n.t('login')}</NavLink>
                </div>
            </div>
            {session.signupSuccessWait === true &&
            <div className="row mt-30">
                <div className="col text-center">
                    <p className="alert alert-success">
                        {i18n.t('signup_success_wait')}
                    </p>
                </div>
            </div>
            }
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginFirst);