import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import {swalDeleteForm, swalError} from '../utils/swal';
import moment from 'moment';
import {NavLink, Redirect} from "react-router-dom";

function MyPosts({
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
        await postService.getMine(session.token)
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
            return <tr><td className="text-center" colSpan="2">{i18n.t('no_data_found')}</td></tr>;

        return data.map(x =>
            <tr key={x._id}>
                <td><img src={x.fileUrl} className="post-image" /></td>
                <td>
                    {x.text} <br/>
                    <span className="post-date">{moment(x.date).format('DD-MMM-YYYY')}</span> <br/>
                    <span className="post-hashtags">{x.hashtags.split(",").map(x => <span className="badge badge-success m-1">{x}</span>)}</span> <br/>
                    <button className="btn btn-sm btn-outline-primary m-1" onClick={e => editRecord(x._id)}>{i18n.t('edit')}</button>
                    <button className="btn btn-sm btn-outline-danger m-1" onClick={e => deleteRecord(x._id)}>{i18n.t('delete')}</button>
                </td>
            </tr>);
    }

    const editRecord = id => {
        setRedirectTo(`/posts-new/${id}`);
    }

    const deleteRecord = id => {
        swalDeleteForm(i18n.t('are_you_sure'), i18n.t('You_wont_be_able_to_revert_this'), i18n.t('delete'), i18n.t('cancel'), () => {
            postService.delete(session.token, id)
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
                    <h4>{i18n.t('my_posts')}</h4>
                </div>
                <div className="col text-right">
                    <NavLink to="/posts-new" className="btn btn-primary">{i18n.t('add_new')}</NavLink>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    <div className="table-responsive">
                    <table className="table w-100">
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPosts);