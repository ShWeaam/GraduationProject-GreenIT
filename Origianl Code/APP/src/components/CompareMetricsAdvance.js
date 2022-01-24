import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import userService from '../services/user';
import {swalDeleteForm, swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import {Bar} from 'react-chartjs-2';
import Select from 'react-select';
import Grid from "./Grid";
import CompareMetricsWithSameCity from "./CompareMetricsWithSameCity";
import CompareMetricsHistory from "./CompareMetricsHistory";
import CompareMetricsAdvanceView1 from "./CompareMetricsAdvanceView1";
import CompareMetricsAdvanceView2 from "./CompareMetricsAdvanceView2";

function CompareMetricsAdvance({
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
    const [view, setView] = useState(1);

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
        {headerName: "School", field: "name", sortable: true},
        {headerName: "Current", field: "current", sortable: true},
        {headerName: "Previous", field: "previous", sortable: true},
        {headerName: "Average", field: "average", sortable: true}
    ];

    const handleSubmit = e => {
        e.preventDefault();

        let metric = selectedMetric && selectedMetric.value || ``;
        let ids = selectedUserIds && selectedUserIds.length > 0 && selectedUserIds.map(x => x.value) || [];

        if (!metric || ids.length === 0) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        setErrorMessage(null);
        metricService.getForComparison(session.token, metric, ids)
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
            <div className="row mt-20">
                <div className="col">
                    <h3>{i18n.t('compare_metrics')}</h3>
                </div>
            </div>

            <div className="row mt-20">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                               type="radio"
                               name="inlineRadioOptions"
                               id="inlineRadio1"
                               value={1}
                               defaultChecked={true}
                               onClick={() => setView(1)}/>
                        <label className="form-check-label"
                               htmlFor="inlineRadio1">{i18n.t('way_1')}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                               type="radio"
                               name="inlineRadioOptions"
                               id="inlineRadio2"
                               value={2}
                               onClick={() => setView(2)}/>
                        <label className="form-check-label"
                               htmlFor="inlineRadio2">{i18n.t('way_2')}</label>
                    </div>
                </div>
            </div>

            <div className="row mt-20">
                <div className="col">
                    {
                        view === 1 && <CompareMetricsAdvanceView1/>
                    }
                    {
                        view === 2 && <CompareMetricsAdvanceView2/>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsAdvance);