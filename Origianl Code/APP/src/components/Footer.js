import React from 'react';
import {useTranslation} from "react-i18next";
import {NavLink} from 'react-router-dom';
import config from '../config.json';

function Footer(props) {
    const {i18n} = useTranslation();
    return (
        <>
            <div style={{
                height: '10vh',
                width: '100%'
            }}></div>
            <div className="footer">
                <div className="row" style={{marginRight: '0px', marginLeft: '0px'}}>
                    <div className="col text-left">
                        <p>{i18n.t('copy_right')} © <a href="http://localhost:3000/" target="_blank">{config.appName}</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;