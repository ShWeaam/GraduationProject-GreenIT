import React from 'react';
import {useTranslation} from "react-i18next";
import SocialLogin from 'react-social-login';

function SocialButton(props) {

    const {i18n} = useTranslation();

    return (
        <button onClick={props.triggerLogin} {...props}>
            { props.children }
        </button>
    );
}

export default SocialLogin(SocialButton);