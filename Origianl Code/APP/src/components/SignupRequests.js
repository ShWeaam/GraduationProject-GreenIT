import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import userService from '../services/user';
import {swalDeleteForm, swalError} from '../utils/swal';
import moment from 'moment';

function SignupRequests({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await userService.getSignupRequests(session.token)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }
                setData(result.data);
            });
    }

    const renderData = () => {
        if (data.length === 0)
            return <tr><td className="text-center" colSpan="6">{i18n.t('no_data_found')}</td></tr>;

        return data.map(x =>
            <tr key={x._id}>
                <td>{x.name}</td>
                <td>{x.username}</td>
                <td>{x.email}</td>
                <td>{moment(x.joined).format('DD-MMM-YYYY')}</td>
                <td>{x.phone}</td>
                <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={e => approveSignup(x._id)}>{i18n.t('approve')}</button>
                    <button className="btn btn-sm btn-outline-danger ml-1" onClick={e => declineSignup(x._id)}>{i18n.t('decline')}</button>
                </td>
            </tr>);
    }

    const approveSignup = userId => {
        userService.activateAccount(session.token, userId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }
                getData();
            });
    }

    const declineSignup = userId => {
        swalDeleteForm(i18n.t('are_you_sure'), i18n.t('You_wont_be_able_to_revert_this'), i18n.t('delete'), i18n.t('cancel'), () => {
            userService.deleteAccount(session.token, userId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }
                    getData();
                });
        });
    }

    return (
        <div className="container my-ads">
            <div className="row mt-20">
                <div className="col-12">
                    <h4>{i18n.t('signup_requests')}</h4>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered w-100">
                        <thead>
                        <tr>
                        <th>{i18n.t('name')}</th>
                        <th>{i18n.t('username')}</th>
                        <th>{i18n.t('email')}</th>
                        <th>{i18n.t('requested')}</th>
                        <th>{i18n.t('phone')}</th>
                        <th>{i18n.t('options')}</th>
                        </tr>
                        </thead>
                        <tbody>
                            {renderData()}
                        </tbody>
                    </table>
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
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupRequests);