import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import orgService from '../services/org';
import utils from '../utils/utils';
import MapLocation from "./MapLocation";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

function ContactInfoRodal(props) {
    return <Rodal visible={true}
                  onClose={props.close}
                  closeOnEsc={false}
                  closeMaskOnClick={false}
                  customStyles={utils.rodalSmallHorizontal()}>
        <div className="container-fluid text-center">
            <div className="row" style={{marginTop: '100px'}}>
                <div className="col">
                    {props.data.email}
                    <br/>
                    {props.data.phone}
                    <br/>
                    {props.data.city}, {props.data.street} {props.data.number}
                </div>
            </div>
        </div>
    </Rodal>
}

function DetailsRodal(props) {
    return <Rodal visible={true}
                  onClose={props.close}
                  closeOnEsc={false}
                  closeMaskOnClick={false}
                  customStyles={utils.rodalSmallHorizontal()}>
        <div className="container-fluid text-center">
            <div className="row text-left mt-20">
                <div className="col">
                    {props.data.details}
                </div>
            </div>
        </div>
    </Rodal>
}

function MapRodal(props) {
    let url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`;
    return <Rodal visible={true}
                  onClose={props.close}
                  closeOnEsc={false}
                  closeMaskOnClick={false}
                  customStyles={utils.rodalBig()}>
        <MapLocation
            googleMapURL={url}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `600px` }} />}
            mapElement={<div style={{ height: `100%` }} />}

            height={'600px'}
            width={'100%'}
            mapLocation={{
                lat: parseFloat(props.data.lat),
                lng: parseFloat(props.data.lng)
            }} />
    </Rodal>
}

function GreenOrg({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [mapLocation, setMapLocation] = useState('');
    const [googleMapURL, setGoogleMapURL] = useState(null);
    const [data, setData] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);
    const [details, setDetails] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        orgService.getAll(session.token)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let data = result.data;
                console.log(data);
                setData(data);
            });
    }, []);

    const render = () => {
        if(data.length === 0)
            return <div>{i18n.t('no_data_found')}</div>

        return data.map(k => {
            return <div className="card">
                <img className="card-img-top" src={k.fileUrl} style={{height: '300px'}} />
                    <div className="card-body text-center">
                        <h5 className="card-title">{k.name}</h5>
                        <p className="card-text">
                            {k.brief}
                        </p>
                        <button className="btn btn-sm btn-light m-1" onClick={() => setContactInfo(k)}>{i18n.t('contact')}</button>
                        <button className="btn btn-sm btn-light m-1" onClick={() => setDetails(k)}>{i18n.t('details')}</button>
                        <button className="btn btn-sm btn-light m-1" onClick={() => setMap(k)}>{i18n.t('map')}</button>
                        <a target="_blank" href={k.website} className="btn btn-sm btn-light m-1">{i18n.t('website')}</a>
                    </div>
            </div>
        });
    }

    return (
        <div className="container">
            {contactInfo && <ContactInfoRodal data={contactInfo} close={() => setContactInfo(null)} />}
            {details && <DetailsRodal data={details} close={() => setDetails(null)} />}
            {map && <MapRodal data={map} close={() => setMap(null)} />}
            <div className="row mt-20">
                <div className="col">
                <h2>{i18n.t('green_org')}</h2>
                </div>
            </div>
            <div className="row text-left mt-20">
                <div className="col">
                    <div className="orgs">
                        {data && render()}
                    </div>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GreenOrg);