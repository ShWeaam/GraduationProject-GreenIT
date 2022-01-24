import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import {swalInfo} from "../utils/swal";
import axios from 'axios';
import i18n from "i18next";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";

function Event({
                   session,
                   setKey,
                   ...props
               }) {
    const {i18n} = useTranslation();
    const format = "YYYY-MM-DDThh:mm";
    const currentDateTime = moment();
    const [title, setTitle] = useState('');
    const [startedAt, setStartedAt] = useState(currentDateTime);
    const [finishedAt, setFinishedAt] = useState(currentDateTime);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        setStartedAt(moment(props.start).format(format));
        setFinishedAt(moment(props.end).format(format));
        if (props.selectedEvent) {
            setTitle(props.selectedEvent.summary);
            setStartedAt(moment(props.selectedEvent.start).format(format));
            setFinishedAt(moment(props.selectedEvent.end).format(format));
            setDescription(props.selectedEvent.description);
        }
    }, []);

    const onChangeAnyField = () => {
        setErrorMessage(null);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if(!title || !startedAt || !finishedAt || !description) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        props.addEvent({
            summary: title,
            start: {
                dateTime: (new Date(startedAt)).toISOString()
            },
            end: {
                dateTime: (new Date(finishedAt)).toISOString()
            },
            description: description
        });
    }

    const clear = () => {
        const currentDateTime = moment().format("YYYY-MM-DDThh:mm");
        setStartedAt(currentDateTime);
        setFinishedAt(currentDateTime);
        setTitle('');
        setDescription('');
        setErrorMessage(null);
    }

    return (
        <Rodal visible={true}
               onClose={() => {
                   clear();
                   props.onClose();
               }}
               closeOnEsc={true}
               closeMaskOnClick={false}
               customStyles={{
                   width: '50%',
                   height: '70%',
                   overflow: 'auto'
               }}>
            <div className="container text-center">
                <form onSubmit={handleSubmit}>
                    <h4 className="m-4">{props.selectedEvent && i18n.t('event_details') || i18n.t('create_event')}</h4>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label>{i18n.t('title')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('title')} required="required"
                                       onBlur={onChangeAnyField}
                                       value={title} onChange={e => setTitle(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label>{i18n.t('start_date')}<span className="red">*</span></label>
                                <input type="datetime-local" className="form-control"
                                       onBlur={onChangeAnyField}
                                       value={startedAt} onChange={e => setStartedAt(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col text-left">
                            <div className="form-group">
                                <label>{i18n.t('end_date')}<span className="red">*</span></label>
                                <input type="datetime-local" className="form-control"
                                       onBlur={onChangeAnyField}
                                       value={finishedAt} onChange={e => setFinishedAt(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label>{i18n.t('description')}<span className="red">*</span></label>
                                <input type="text" className="form-control"
                                       placeholder={i18n.t('description')} required="required"
                                       onBlur={onChangeAnyField}
                                       value={description} onChange={e => setDescription(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-secondary m-1"
                                onClick={props.onClose}>
                                {i18n.t('close')}
                            </button>
                            {
                                !props.selectedEvent  &&
                                <button
                                    type="submit"
                                    className="btn btn-primary m-1"
                                    onClick={handleSubmit}>
                                    {i18n.t('submit')}
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </Rodal>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Event);