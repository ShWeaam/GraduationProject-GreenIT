import React, {useState, useEffect} from 'react';
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import AllPosts from "./AllPosts";
import {Bar} from "react-chartjs-2";
import metricService from "../services/metric";
import {swalError} from "../utils/swal";
import keys from "../store/keys";
import {NavLink} from "react-router-dom";
import MyCalendar from './Calendar';
import LoginFirst from "./LoginFirst";
import AddPost from "./AddPost";

function Home({
                  session,
                  setKey,
                  ...props
              }) {

    const {i18n} = useTranslation();
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        if (session.isLoggedIn) {
            const userId = session.user._id;
            getChartData(userId);
        }
    }, []);

    const getChartData = async userId => {
        await metricService.getByUserId2(session.token, userId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let t = result.data;
                let t_datasets = [{
                    label: t.userId && t.userId.name || ``,
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
    }

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

    if (!session || !session.isLoggedIn) {
        return <LoginFirst/>
    }

    return (
        <div className="container-fluid home">
            <div className="row mt-10">
                <div className="col" style={{width: '600px', height: '400px'}}>
                    <span className="h2 mr-10">{i18n.t('recent_metrics')}</span>
                    <NavLink to="/metrics-compare">{i18n.t('compare_metrics')}</NavLink>
                    <Bar data={{
                        labels: [
                            i18n.t('water'),
                            i18n.t('electricity'),
                            i18n.t('gas'),
                            i18n.t('paper'),
                            i18n.t('disposables')
                        ],
                        datasets: datasets
                    }} options={chartOptions}/>
                </div>
                <div className="col">
                    <MyCalendar/>
                </div>
            </div>
            <div className="row mt-10">
                <div className="col">
                    <AddPost />
                </div>
            </div>
            <div className="row mt-10">
                <div className="col">
                    <AllPosts />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({session: store.session});
const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);