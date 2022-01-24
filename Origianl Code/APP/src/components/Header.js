import React, {useState, useEffect} from 'react';
import {Redirect, NavLink, BrowserRouter} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from '../store/keys';
import {setKey, getKey, clearKeys} from '../store/actions';
import {connect} from "react-redux";
import Cookies from 'universal-cookie';

const BOOTSTRAP_CSS_LTR = "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css";
const BOOTSTRAP_CSS_RTL = "https://cdn.rtlcss.com/bootstrap/v4.2.1/css/bootstrap.min.css";
const BOOTSTRAP_JS_LTR = "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js";
const BOOTSTRAP_JS_RTL = "https://cdn.rtlcss.com/bootstrap/v4.2.1/js/bootstrap.bundle.min.js";
const APP_CSS_LTR = "/css/app.all.css";
const APP_CSS_RTL = "/css/app.all.rtl.css";

function Header({
                    session,
                    setKey,
                    clearKeys,
                    ...props
                }) {
    const {i18n} = useTranslation();
    const [lang, setLang] = useState('en');
    const [dir, setDir] = useState('ltr');

    useEffect(() => {
        if (session.language === 'en' && session.direction === 'ltr') {
            implementLtr();
        } else if (session.language === 'hebrew' && session.direction === 'rtl') {
            implementRtl();
        } else {
            implementLtr();
        }
    }, []);

    const switchLanguage = e => {
        e.preventDefault();
        const dir = e.target.value === 'en' ? "ltr" : "rtl";
        if (dir === 'ltr') {
            implementLtr();
        } else if (dir === 'rtl') {
            implementRtl();
        }
    }

    const implementLtr = () => {
        setLang('en');
        setDir('ltr');
        setKey(keys.language, 'en');
        setKey(keys.direction, 'ltr');
        i18n.changeLanguage('en');
        document.getElementsByTagName('html')[0].setAttribute("dir", 'ltr');
        removeRtlLibs();
        addLtrLibs();
    }

    const implementRtl = () => {
        setLang('hebrew');
        setDir('rtl');
        setKey(keys.language, 'hebrew');
        setKey(keys.direction, 'rtl');
        i18n.changeLanguage('hebrew');
        document.getElementsByTagName('html')[0].setAttribute("dir", 'rtl');
        removeLtrLibs();
        addRtlLibs();
    }

    const addLtrLibs = () => {
        let css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = APP_CSS_LTR;
        document.getElementsByTagName('head')[0].prepend(css);

        css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = BOOTSTRAP_CSS_LTR;
        document.getElementsByTagName('head')[0].prepend(css);

        let js = document.createElement("script");
        js.src = BOOTSTRAP_JS_LTR;
        js.type = "text/javascript";
        document.getElementsByTagName('body')[0].appendChild(js);
    }

    const removeLtrLibs = () => {
        if (document.querySelector(`script[src*="${BOOTSTRAP_JS_LTR}"]`))
            document.querySelector(`script[src*="${BOOTSTRAP_JS_LTR}"]`).remove();

        if (document.querySelector(`link[href*="${BOOTSTRAP_CSS_LTR}"]`))
            document.querySelector(`link[href*="${BOOTSTRAP_CSS_LTR}"]`).remove();
        if (document.querySelector(`link[href*="${APP_CSS_LTR}"]`))
            document.querySelector(`link[href*="${APP_CSS_LTR}"]`).remove();
    }

    const addRtlLibs = () => {
        let css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = APP_CSS_RTL;
        document.getElementsByTagName('head')[0].prepend(css);

        css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = BOOTSTRAP_CSS_RTL;
        document.getElementsByTagName('head')[0].prepend(css);

        let js = document.createElement("script");
        js.src = BOOTSTRAP_JS_RTL;
        js.type = "text/javascript";
        document.getElementsByTagName('body')[0].appendChild(js);
    }

    const removeRtlLibs = () => {
        if (document.querySelector(`script[src*="${BOOTSTRAP_JS_RTL}"]`))
            document.querySelector(`script[src*="${BOOTSTRAP_JS_RTL}"]`).remove();

        if (document.querySelector(`link[href*="${BOOTSTRAP_CSS_RTL}"]`))
            document.querySelector(`link[href*="${BOOTSTRAP_CSS_RTL}"]`).remove();
        if (document.querySelector(`link[href*="${APP_CSS_RTL}"]`))
            document.querySelector(`link[href*="${APP_CSS_RTL}"]`).remove();
    }

    const handleLogout = e => {
        e.preventDefault();

        setTimeout(() => {
            if (session.cookie) {
                const cookies = new Cookies();
                cookies.remove(session.cookie);
            }
            clearKeys();
            setKey(keys.isLoggedIn, false);
            window.location.href = "/";
        }, 500);
    }

    return (
        <div className="main-header">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    <img className="img-logo" src="/logo.png"/>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {
                        session.isLoggedIn !== true &&
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#"
                                         onClick={() => setKey(keys.showSignup, true)}>{i18n.t('signup')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#"
                                         onClick={() => setKey(keys.showLogin, true)}>{i18n.t('login')}</NavLink>
                            </li>
                        </ul>
                    }
                    {
                        session.isLoggedIn === true && session.user &&
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" exact to="/">{i18n.t('dashboard')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={`/my-profile`}>{i18n.t('my_profile')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/metrics-compare">{i18n.t('compare_metrics')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/green">{i18n.t('green_org')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/calendar">{i18n.t('calendar')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/my-posts">{i18n.t('my_posts')}</NavLink>
                            </li>
                            <li className="nav-item dropdown li-username-header">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img id="img-circle-header" className="img-circle-header"
                                         src={`${session.user.fileUrl}`}/>
                                    <span id="username-header">{session.user.name}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right user-dropdown"
                                     aria-labelledby="navbarDropdownMenuLink">
                                    {session.user.type === 1 && <NavLink className="dropdown-item" to='/supervisors'>
                                        <i className="fa fa-users-cog"></i>{i18n.t('supervisors')}</NavLink>}
                                    {session.user.type === 1 && <NavLink className="dropdown-item" to='/supervisors-new/'>
                                        <i className="fa fa-user-secret"></i>{i18n.t('add_supervisor')}</NavLink>}
                                    {session.user.type === 1 && <NavLink className="dropdown-item" to='/signup-requests/'>
                                        <i className="fa fa-user-plus"></i>{i18n.t('signup_requests')}</NavLink>}
                                    {session.user.type === 1 && <NavLink className="dropdown-item" to='/add-org'>
                                        <i className="fa fa-user-plus"></i>{i18n.t('add_green_org')}</NavLink>}
                                    <NavLink className="dropdown-item" to="/metrics"><i
                                        className="fa fa-cogs"></i>{i18n.t('manage_metrics')}</NavLink>
                                    <NavLink className="dropdown-item" to="/metrics-new"><i
                                        className="fa fa-cogs"></i>{i18n.t('add_metrics')}</NavLink>
                                    <NavLink className="dropdown-item" to={`/profile/${session.user._id}`}><i
                                        className="fa fa-user-circle"></i>{i18n.t('my_public_profile')}</NavLink>
                                    <NavLink className="dropdown-item" to="/settings"><i
                                        className="fa fa-cog"></i>{i18n.t('settings')}</NavLink>
                                    <button className="dropdown-item red" onClick={handleLogout}>
                                        <i className="fa fa-sign-out-alt"></i>{i18n.t('logout')}
                                    </button>
                                </div>
                            </li>
                        </ul>
                    }
                    <select className="form-control" style={{width: '100px'}} value={lang} onChange={switchLanguage}>
                        <option value="en">English</option>
                        <option value="hebrew">עִברִית</option>
                    </select>
                </div>
            </nav>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);