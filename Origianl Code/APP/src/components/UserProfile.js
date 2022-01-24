import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import utils from '../utils/utils';
import userService from '../services/user';
import {swalConfirm, swalError, swalInfo, swalShare} from "../utils/swal";
import MyPosts from "./MyPosts";
import UserPosts from "./UserPosts";
import moment from 'moment';
import {NavLink} from "react-router-dom";
import {Bar} from "react-chartjs-2";
import metricService from "../services/metric";

function UserProfile({
                         session,
                         setKey,
                         ...props
                     }) {
    const {i18n} = useTranslation();
    const [user, setUser] = useState(null);
    const [datasets, setDatasets] = useState([]);
    const chartOptions = {
        type: 'bar',
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    useEffect(() => {
        const userId = props.match.params.userId;
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

        metricService.getByUserId2(session.token, userId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let t = result.data;
                let t_datasets = [{
                    label: t.userId && t.userId.name || '',
                    data: [t.water, t.electricity, t.gas, t.paper, t.disposables],
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }];
                setDatasets(t_datasets);
            });
    }, []);

    const handleCopyUrl = e => {
        e.preventDefault();
        swalShare(i18n.t('Copy_public_URL'), i18n.t('Copy_URL'), i18n.t('close'), `${process.env.REACT_APP_APP_URL}/profile/${session.user._id}`);
    }

    return (
        <div className="container user-profile">
            {
                user &&
                    <>
                    <div className="row mt-30 mb-30">
                        <div className="col-sm-3 text-center">
                            <div className="row">
                                <div className="col">
                                    <img className="profile-image" src={`${user.fileUrl}`}/> <br/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-8 text-left">
                                    <h1>{user.name}</h1>
                                    <table>
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
                                            <td>{i18n.t('member_since')} {moment(user.joined).format('DD-MMM-YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-user-clock"></i></td>
                                            <td>{i18n.t('qualified_since')} {moment(user.qualified).format('DD-MMM-YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'center'}}><i className="fa fa-map-marker-alt"></i></td>
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
                                    </table>
                                </div>
                                <div className="col-sm-4 text-right">
                                    <i className="fa fa-share-alt hover-blue" data-toggle="tooltip"
                                       title={i18n.t('copy_public_url_to_share')} onClick={handleCopyUrl}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                        <hr />
                    <div className="row mt-30">
                        <div className="col">
                            <span className="h2 mr-10">{i18n.t('recent_metrics')}</span>
                            <Bar data={{
                                labels: ['Water', 'Electricity', 'Gas', 'Paper', 'Disposables'],
                                datasets: datasets
                            }} options={chartOptions} />
                        </div>
                        <div className="col">
                            <UserPosts userId={user._id} />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);