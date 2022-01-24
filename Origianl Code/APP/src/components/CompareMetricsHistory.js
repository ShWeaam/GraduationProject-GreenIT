import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import {swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import { Line } from 'react-chartjs-2';
import moment from 'moment';

function CompareMetricsHistory({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [aboveAvg, setAboveAvg] = useState([]);

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
                // let t_metrics = [
                //     i18n.t('water'),
                //     i18n.t('electricity'),
                //     i18n.t('gas'),
                //     i18n.t('paper'),
                //     i18n.t('disposables')
                // ];
                let t_metrics = [
                    'Water',
                    'Electricity',
                    'Gas',
                    'Paper',
                    'Disposables'
                ];
                let t_labels = result.data.map(k => moment(k.date).format("MMMM YYYY"));
                let t_datasets = [];
                for(let i = 0; i < t_metrics.length; i++) {
                    let t = t_metrics[i];
                    t_datasets.push({
                        label: i18n.t(t.toLocaleLowerCase()),
                        data: result.data.map(k => k[t.toLowerCase()]),
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
                        borderWidth: 2,
                    });
                }

                setLabels(t_labels);
                setDatasets(t_datasets);
            });
    }

    const options = {
        type: 'line',
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    }
                },
            ],
        },
    };

    return (
        <div className="container my-ads">
            <div className="row">
                <div className="col text-right">
                    {
                        aboveAvg.length > 0 && <NavLink to={`/tips?for=${aboveAvg.join(',')}`} className="btn btn-link">{i18n.t('show_tips')}</NavLink>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Line data={{
                        labels: labels,
                        datasets: datasets
                    }} options={options} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsHistory);