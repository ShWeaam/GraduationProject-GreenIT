import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import {swalError} from '../utils/swal';
import {NavLink, Redirect} from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import utils from "../utils/utils";
import Tips from "./Tips";
import MonthYearPicker from "./MonthYearPicker";
import moment from "moment";

function CompareMetricsWithSameCity({
                     session,
                     setKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [aboveAvg, setAboveAvg] = useState([]);
    const [showTips, setShowTips] = useState(false);
    const lng = localStorage.getItem("language");

    const getData = (date, cb) => {
        metricService.getByCity(session.token, date)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setData(result.data);
                const colors = utils.getRandomColors(result.data.length);
                let t_labels = [
                    i18n.t('water'),
                    i18n.t('electricity'),
                    i18n.t('gas'),
                    i18n.t('paper'),
                    i18n.t('disposables')
                ];
                let t_datasets = [];
                for(let i = 0; i < result.data.length; i++) {
                    let t = result.data[i];
                    t_datasets.push({
                        label: t.userId.name,
                        data: [t.water, t.electricity, t.gas, t.paper, t.disposables],
                        borderColor: colors.hoverColors[i],
                        backgroundColor: colors.colors[i],
                        hoverBackgroundColor: colors.hoverColors[i],
                        borderWidth: 1,
                    });
                }
                setLabels(t_labels);
                setDatasets(t_datasets);
                cb(result.data);
            });
    }

    const comparePastData = users => {
        metricService.getAverageByUserId(session.token)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let avgData = result.data;
                let userId = session.user._id;
                let currentUserData = users.find(k => k.userId._id.toString() === userId);
                if(currentUserData) {
                    let aboveAvgTemp = [];
                    if (currentUserData.water > avgData.avgWater)
                        aboveAvgTemp.push('water');
                    if (currentUserData.electricity > avgData.avgElectricity)
                        aboveAvgTemp.push('electricity');
                    if (currentUserData.gas > avgData.avgGas)
                        aboveAvgTemp.push('gas');
                    if (currentUserData.paper > avgData.avgPaper)
                        aboveAvgTemp.push('paper');
                    if (currentUserData.disposables > avgData.avgDisposables)
                        aboveAvgTemp.push('disposables');

                    if (aboveAvgTemp.length > 0) {
                        setAboveAvg(aboveAvgTemp);
                    }
                }
            });
    }

    const options = {
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

    const handleSubmit = e => {
        e.preventDefault();
        setAboveAvg([]);
        setDatasets([]);
        setShowTips(false);
        let month = document.getElementById('ddl-month').value;
        let year = document.getElementById('ddl-year').value;

        let date = moment().date(2).month(month-1).year(year).format();
        getData(date, usrs => {
            comparePastData(usrs);
        });
    }

    return (
        <div className="container my-ads">
            <div className="row">
                <div className="col">
                    <label>{i18n.t('select_month')}</label>
                    <MonthYearPicker />
                </div>
                <div className="col" style={{marginTop: '30px'}}>
                    <button className="btn btn-primary" onClick={handleSubmit}>{i18n.t('compare_metrics')}</button>
                </div>
            </div>
            <div className="row mt-30">
                {
                    datasets.length === 0 &&
                        <div className="col-12">{i18n.t('no_data_found')}</div>
                }
                {
                    datasets.length > 0 &&
                    <div className={aboveAvg.length > 0 ? "col-10" : "col-12"}>
                        <Bar data={{
                            labels: labels,
                            datasets: datasets
                        }} options={options} />
                    </div>
                }
                {console.log(aboveAvg)}
                {
                    datasets.length > 0 && aboveAvg.length > 0 && !showTips &&
                    <div className="col-2">
                        <div className="tip-box">
                            {
                                (aboveAvg.includes('water') &&
                                    <>
                                        {utils.getRandomTipForWater(lng)}
                                        <br/>
                                        <button className="btn btn-link" onClick={() => setShowTips(true)}>{i18n.t('show_tips')}</button>
                                    </>) ||
                                (aboveAvg.includes('electricity') &&
                                    <>
                                        {utils.getRandomTipForElectricity(lng)}
                                        <br/>
                                        <button className="btn btn-link" onClick={() => setShowTips(true)}>{i18n.t('show_tips')}</button>
                                    </>) ||
                                (aboveAvg.includes('gas') &&
                                    <>
                                        {utils.getRandomTipForGas(lng)}
                                        <br/>
                                        <button className="btn btn-link" onClick={() => setShowTips(true)}>{i18n.t('show_tips')}</button>
                                    </>) ||
                                (aboveAvg.includes('paper') &&
                                    <>
                                        {utils.getRandomTipForPaper(lng)}
                                        <br/>
                                        <button className="btn btn-link" onClick={() => setShowTips(true)}>{i18n.t('show_tips')}</button>
                                    </>) ||
                                (aboveAvg.includes('disposables') && 
                                    <>
                                        {utils.getRandomTipForDisposables(lng)}
                                        <br/>
                                        <button className="btn btn-link" onClick={() => setShowTips(true)}>{i18n.t('show_tips')}</button>
                                    </>) || null
                            }
                        </div>
                    </div>
                }
            </div>
            {
                showTips &&
                <div className="row">
                    <div className="col">
                        <Tips for={aboveAvg} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareMetricsWithSameCity);