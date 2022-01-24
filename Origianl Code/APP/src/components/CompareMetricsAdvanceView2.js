import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import userService from '../services/user';
import {swalDeleteForm, swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import {Bar, Line} from 'react-chartjs-2';
import Select from 'react-select';
import Grid from "./Grid";
import moment from 'moment';
import MonthYearPicker from './MonthYearPicker';


function CompareMetricsAdvanceView2({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([
        i18n.t('water'),
        i18n.t('electricity'),
        i18n.t('gas'),
        i18n.t('paper'),
        i18n.t('disposables')
    ]);
    const [barChartDataset, setBarChartDataset] = useState([]);
    const [lineChartDataset, setLineChartDataset] = useState([]);
    const [lineChartLabels, setLineChartLabels] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [month, setMonth] = useState(moment().month()+1);
    const [year, setYear] = useState(moment().year());

    const metricsOptions = [
        {label: i18n.t('water'), value: 'Water'},
        {label: i18n.t('electricity'), value: 'Electricity'},
        {label: i18n.t('gas'), value: 'Gas'},
        {label: i18n.t('paper'), value: 'Paper'},
        {label: i18n.t('disposables'), value: 'Disposables'}
    ];
    const [users, setUsers] = useState([]);

    useEffect(() => {
        userService.getAllUsers(session.token)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                const usernames = result.data.map(k => {
                    return {
                        label: k.name,
                        value: k._id
                    };
                });
                setUsers(usernames);
            });
    }, []);

    const getLineChartData = async () => {
        if(!selectedUserIds.value) return;
        await metricService.getUserHistory(session.token, selectedUserIds.value)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

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

                setLineChartLabels(t_labels);
                setLineChartDataset(t_datasets);
            });
    }

    const barChartOptions = {
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
        }
    };

    const lineChartOptions = {
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

    const handleSubmit = e => {
        e.preventDefault();

        let userId = selectedUserIds.value;
        let month = document.getElementById('ddl-month').value;
        let year = document.getElementById('ddl-year').value;

        if(!userId) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        setErrorMessage(null);
        metricService.getByUserId3(session.token, userId, moment().date(2).month(month-1).year(year))
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let t = result.data;
                let t_datasets = [];
                for(let i = 0; i < result.data.length; i++) {
                    let t = result.data[i];
                    t_datasets.push({
                        label: t.userId.name,
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
                        borderWidth: 1,
                    });
                }

                setBarChartDataset(t_datasets);
                getLineChartData();
            });
    }

    return (
        <div className="container my-ads">
            <div className="row mt-10">
                <div className="col">
                    <label>{i18n.t('select_schools')}</label>
                    <Select options={users} isMulti={false}
                            closeMenuOnSelect={true}
                            placeholder={i18n.t('select_placeholder')}
                            value={selectedUserIds} onChange={setSelectedUserIds}
                    />
                </div>
                <div className="col">
                    <label>{i18n.t('select_month')}</label>
                    <MonthYearPicker />
                </div>
            </div>
            <div className="row mt-10">
                <div className="col text-right">
                    <button className="btn btn-primary" onClick={handleSubmit}>{i18n.t('compare_metrics')}</button>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
            </div>
            {
                barChartDataset.length === 0 && <span>{i18n.t('no_data_found')}</span>
            }
            {
                barChartDataset.length > 0 &&
                <div className="row mt-30">
                    <div className="col-12">
                        <Bar data={{
                            labels: labels,
                            datasets: barChartDataset
                        }} options={barChartOptions} />
                    </div>
                </div>
            }
            {
                barChartDataset.length > 0 &&
                <div className="row mt-30">
                    <div className="col-12">
                        <Line data={{
                            labels: lineChartLabels,
                            datasets: lineChartDataset
                        }} options={lineChartOptions} />
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsAdvanceView2);