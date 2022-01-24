import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import userService from '../services/user';
import {swalDeleteForm, swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import Grid from "./Grid";
import moment from 'moment';
import MonthYearPicker from './MonthYearPicker';


function CompareMetricsAdvanceView1({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [tableData, setTableData] = useState([]);
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
                setSelectedUserIds(usernames);
            });
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
                let t_labels = [
                    i18n.t('water'),
                    i18n.t('electricity'),
                    i18n.t('gas'),
                    i18n.t('paper'),
                    i18n.t('disposables')
                ];
                let t_datasets = [{
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
                    borderWidth: 1
                }];
                setLabels(t_labels);
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

    const columnDefs = [
        {headerName: i18n.t('school'), field: "name", sortable: true},
        {headerName: i18n.t('current'), field: "current", sortable: true},
        {headerName: i18n.t('previous'), field: "previous", sortable: true},
        {headerName: i18n.t('average'), field: "average", sortable: true}
    ];

    const handleSubmit = e => {
        e.preventDefault();

        let metric = selectedMetric && selectedMetric.value || ``;
        let ids = selectedUserIds && selectedUserIds.length > 0 && selectedUserIds.map(x => x.value) || [];
        let month = document.getElementById('ddl-month').value;
        let year = document.getElementById('ddl-year').value;

        if(!metric || ids.length === 0) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        setErrorMessage(null);
        metricService.getForComparison(session.token, metric, ids, moment().date(2).month(month-1).year(year))
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let t = result.data;
                setTableData(t);
            });
    }

    const onRowClicked = e => {
        document.querySelectorAll(`.my-row`).forEach(k => k.style.backgroundColor = '#FCFDFE');
        e.event.target.parentNode.style.backgroundColor = '#c6dff1';
        setSelectedSchool(e.data);
        getChartData(e.data.userId);
    }

    return (
        <div className="container my-ads">
            <div className="row mt-10">
                <div className="col">
                    <label>{i18n.t('select_metrics')}</label>
                    <Select options={metricsOptions} isMulti={false}
                            placeholder={i18n.t('select_placeholder')}
                            value={selectedMetric} onChange={setSelectedMetric}
                    />
                </div>
                <div className="col">
                    <label>{i18n.t('select_month')}</label>
                    <MonthYearPicker />
                </div>
                <div className="col">
                    <label>{i18n.t('select_schools')}</label>
                    <Select options={users} isMulti={true}
                            closeMenuOnSelect={false}
                            placeholder={i18n.t('select_placeholder')}
                            value={selectedUserIds} onChange={setSelectedUserIds}
                    />
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
            <div className="row mt-30">
                <div className="col-12">
                    <Grid
                        columnDefs={columnDefs}
                        rowData={tableData}
                        onRowClicked={onRowClicked}
                    />
                    <small>{i18n.t('click_on_school')}</small>
                </div>
            </div>
            {
                selectedSchool &&
                    <>
                    <div className="row mt-30">
                        <div className="col-12">
                            <h3>{selectedSchool.name}</h3>
                        </div>
                    </div>
                    <div className="row mt-30">
                        <div className="col-12">
                            <Bar data={{
                                labels: labels,
                                datasets: datasets
                            }} options={chartOptions} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsAdvanceView1);