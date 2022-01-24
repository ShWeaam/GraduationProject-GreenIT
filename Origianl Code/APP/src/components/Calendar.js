import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import metricService from '../services/metric';
import {swalDeleteForm, swalError, swalInfo, swalSuccess} from '../utils/swal';
import moment from 'moment';
import {NavLink, Redirect} from "react-router-dom";
import {Calendar, momentLocalizer} from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ApiCalendar from 'react-google-calendar-api';
import Event from "./Event";

function MyCalendar({
                     session,
                     setKey,
                     ...props
                 }) {
    const [redirectTo, setRedirectTo] = useState(null);
    const {i18n} = useTranslation();
    const [value, onChange] = useState(new Date());
    const localizer = momentLocalizer(moment);
    const [calendar, setCalendar] = useState('');
    const [isSginedIn, setIsSginedIn] = useState(false);

    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [start, setStart] = useState(Date.now());
    const [end, setEnd] = useState(Date.now());

    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID_OLD;
    const API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_KEY_OLD;
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    const SCOPES = "https://www.googleapis.com/auth/calendar.events"

    useEffect(() => {
        setTimeout(() => {
            reloadEvents();
        }, 3000);
    }, []);

    useEffect(() => {
        reloadEvents();
    }, [ApiCalendar.sign]);

    const handleSelect = ({ start, end }) => {
        if(!ApiCalendar.sign) {
            swalInfo(i18n.t('login_first'));
            return;
        }

        setStart(start);
        setEnd(end);
        setShowEventModal(true);
    }

    const handleSelectEvent = event => {
        setSelectedEvent(event);
        setShowEventModal(true);
    }

    const addEvent = event => {
        if (ApiCalendar.sign) {
            ApiCalendar.createEvent(event, 'primary', 'none')
                .then(result => {
                    setSelectedEvent(null);
                    setShowEventModal(false);
                    swalSuccess(i18n.t('event_added_success'));
                    reloadEvents();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    const reloadEvents = () => {
        if (ApiCalendar.sign) {
            ApiCalendar.listEvents({
                timeMin: (new Date(2021, 1, 1)).toISOString(),
                showDeleted: false,
                maxResults: 100,
                orderBy: 'updated'
            }).then(({result}) => {
                let t = result.items.map(x => {
                   return {
                       ...x,
                       title: x.summary,
                       start: moment(x.start.dateTime).toDate(),
                       end: moment(x.end.dateTime).toDate()
                   };
                });
                setEvents(t);
            });
        }
    }

    return (
        <div className="container my-ads">
            {redirectTo && <Redirect push to={redirectTo}/>}
            {
                showEventModal &&
                <Event
                    start={start}
                    end={end}
                    selectedEvent={selectedEvent}
                    onClose={() => {
                        setSelectedEvent(null);
                        setShowEventModal(false);
                    }}
                    addEvent={addEvent}
                />
            }
            <div className="row">
                <div className="col">
                    <h2>{i18n.t('calendar')}</h2>
                </div>
                <div className="col text-right">
                    {/*<button className="btn btn-primary m-1" onClick={handleGetList}>List</button>*/}
                    {!ApiCalendar.sign && <button className="btn btn-primary m-1" onClick={e => ApiCalendar.handleAuthClick()}>{i18n.t('login')}</button>}
                    {ApiCalendar.sign && <button className="btn btn-danger m-1" onClick={e => ApiCalendar.handleSignoutClick()}>{i18n.t('logout')}</button>}
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    {
                        !ApiCalendar.sign && <div>{i18n.t('Connect_to_google_calendar')}</div>
                    }
                    {
                        ApiCalendar.sign &&
                            <div style={{height: window.location.href.split("/").pop() === "" ? '40vh' : '90vh' }}>
                                <Calendar
                                    popup
                                    selectable
                                    localizer={localizer}
                                    events={events}
                                    onSelectSlot={handleSelect}
                                    onSelectEvent={handleSelectEvent}
                                />
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyCalendar);