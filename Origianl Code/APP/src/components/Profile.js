import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import utils from '../utils/utils';
import userService from '../services/user';
import {swalConfirm, swalDeleteForm, swalError, swalShare} from "../utils/swal";
import MyPosts from "./MyPosts";
import moment from "moment";

function Profile({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [redirectTo, setRedirectTo] = useState(null);
    const [user, setUser] = useState(null);


    useEffect(() => {
        const userId = session.user._id;
        setKey(keys.isLoading, true);
        userService.getById(session.token, userId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setUser(result.data);
            });
    }, []);

    const handleCopyUrl = e => {
        e.preventDefault();
        swalShare(i18n.t('Copy_public_URL'), i18n.t('Copy_URL'), i18n.t('close'), `${process.env.REACT_APP_APP_URL}/profile/${session.user._id}`);
    }

    const handlePublicView = e => {
        e.preventDefault();
        setRedirectTo(`/profile/${session.user._id}`);
    }

    const handleDelete = e => {
        e.preventDefault();
        swalDeleteForm(i18n.t('are_you_sure'), i18n.t('You_wont_be_able_to_revert_this'), i18n.t('delete'), i18n.t('cancel'), async () => {
            await userService.delete(session.token)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }

                    setKey(keys.isLoading, false);
                    setRedirectTo(`/`);
                });
        });
    }

    return (
        <div className="container profile">
            {redirectTo && <Redirect push to={redirectTo}/>}
            {
                user &&
                <>
                    <div className="row mt-20">
                        <div className="col-12 col-md-3 text-center">
                            <img className="profile-image" src={`${user.fileUrl}`}/>
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="row">
                                <div className="col-8 col-md-8 text-left">
                                    <h1>{user.name}</h1>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-phone"></i></td>
                                            <td>{user.phone}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-envelope"></i></td>
                                            <td>{user.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-user"></i></td>
                                            <td>{user.username}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-globe"></i></td>
                                            <td><a href={user.website} target="_blank">{user.website}</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-clock"></i></td>
                                            <td>Member since {moment(user.joined).format('DD-MMM-YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-user-clock"></i></td>
                                            <td>Qualified since {moment(user.qualified).format('DD-MMM-YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-map-marker-alt"></i>
                                            </td>
                                            <td>{user.street}, {user.city}.</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-walking"></i>
                                            </td>
                                            <td>
                                                <div className="progress">
                                                    <div className={`progress-bar progress-bar-striped bg-success w-${user.level || 0}`}>
                                                        {`${user.level || 0}%`}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-4 col-md-4 text-right">
                                    <div className="dropdown">
                                        <button className="btn btn-light dropdown-toggle" type="button"
                                                id="my-ad-actions-dropdown"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {i18n.t('actions')}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="my-ad-actions-dropdown">
                                            <button className="dropdown-item hover-blue" onClick={handleCopyUrl}>
                                                <i className="fa fa-share-alt"></i>{i18n.t('copy_public_url')}
                                            </button>
                                            <button className="dropdown-item hover-blue" onClick={handlePublicView}>
                                                <i className="fa fa-eye"></i>{i18n.t('public_view')}
                                            </button>
                                            <button className="dropdown-item hover-orange"
                                                    onClick={e => setRedirectTo(`/edit-profile`)}>
                                                <i className="fa fa-pencil-alt"></i>{i18n.t('edit')}
                                            </button>
                                            <button className="dropdown-item hover-red" onClick={handleDelete}>
                                                <i className="fa fa-trash"></i>{i18n.t('delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <MyPosts/>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);