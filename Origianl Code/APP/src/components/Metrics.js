import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import {swalDeleteForm, swalError} from '../utils/swal';
import moment from 'moment';
import {NavLink, Redirect} from "react-router-dom";

function Metrics({
                     session,
                     setKey,
                     ...props
                 }) {
    const [redirectTo, setRedirectTo] = useState(null);
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await metricService.getByUserId(session.token)
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
            return <tr><td className="text-center" colSpan="7">{i18n.t('no_data_found')}</td></tr>;

        return data.map(x =>
            <tr key={x._id}>
                <td>{x.water}</td>
                <td>{x.electricity}</td>
                <td>{x.gas}</td>
                <td>{x.paper}</td>
                <td>{x.disposables}</td>
                <td>{moment(x.date).format('DD-MMM-YYYY')}</td>
                <td>
                    <button className="btn btn-sm btn-outline-primary m-1" onClick={e => editRecord(x._id)}>{i18n.t('edit')}</button>
                    <button className="btn btn-sm btn-outline-danger m-1" onClick={e => deleteRecord(x._id)}>{i18n.t('delete')}</button>
                </td>
            </tr>);
    }

    const editRecord = id => {
        setRedirectTo(`/metrics-new/${id}`);
    }

    const deleteRecord = id => {
        swalDeleteForm(i18n.t('are_you_sure'), i18n.t('You_wont_be_able_to_revert_this'), i18n.t('delete'), i18n.t('cancel'), () => {
            metricService.delete(session.token, id)
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
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row mt-20">
                <div className="col">
                    <h4>{i18n.t('manage_metrics')}</h4>
                </div>
                <div className="col text-right">
                    <NavLink to="/metrics-new" className="btn btn-primary">{i18n.t('add_new')}</NavLink>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered w-100">
                        <thead>
                        <tr>
                        <th>{i18n.t('water')}</th>
                        <th>{i18n.t('electricity')}</th>
                        <th>{i18n.t('gas')}</th>
                        <th>{i18n.t('paper')}</th>
                        <th>{i18n.t('disposables')}</th>
                        <th>{i18n.t('date')}</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);