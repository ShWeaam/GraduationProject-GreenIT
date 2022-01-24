import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import userService from '../services/user';
import { swalError } from '../utils/swal';
import moment from 'moment';
import {NavLink} from "react-router-dom";

function Supervisors({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        getSupervisors();
    }, []);

    const getSupervisors = async () => {
        await userService.getAll(session.token)
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
            return <tr><td className="text-center" colSpan="5">{i18n.t('no_data_found')}</td></tr>;

        return data.map(x =>
            <tr key={x._id}>
                <td>{x.name}</td>
                <td>{x.username}</td>
                <td>{x.email}</td>
                <td>{moment(x.joined).format('DD-MMM-YYYY')}</td>
                <td>{x.phone}</td>
            </tr>);
    }

    return (
        <div className="container my-ads">
            <div className="row mt-20">
                <div className="col">
                    <h4>{i18n.t('supervisors')}</h4>
                </div>
                <div className="col text-right">
                    <NavLink to="/supervisors-new" className="btn btn-primary">{i18n.t('add_new')}</NavLink>
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
                        <th>{i18n.t('joined')}</th>
                        <th>{i18n.t('phone')}</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(Supervisors);