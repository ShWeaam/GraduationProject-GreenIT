import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import orgService from '../services/org';
import utils from "../utils/utils";
import axios from "axios";


function AddGreenOrg({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const [name, setName] = useState('');
    const [picture, setPicture] = useState(null);
    const [brief, setBrief] = useState('');
    const [details, setDetails] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [website, setWebsite] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = async e => {
        e.preventDefault();

        if(!name || !picture || !brief || !details || !email || !phone || !city || !website || !street || !number) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        let fulladdress = `${city}, ${street}, ${number}`;
        setKey(keys.isLoading, true);
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address:fulladdress,
          key: process.env.REACT_APP_GOOGLE_GEOCODING_KEY
        }
      })
      .then(function(response){
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        console.log(lat, lng);

        let obj = {
            name, 
            file: picture,
            brief,
            details,
            email,
            phone,
            city,
            street,
            number,
            lat,
            lng,
            website
        };
        orgService.create(session.token, obj)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                setKey(keys.isLoading, false);
                setErrorMessage('');
                setSuccessMessage(i18n.t('data_add_success'));
            });
      })
      .catch(function(error){
        console.log(error);
      });
        
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
            </div>
            <div className="row mt-20">
                <div className="col">
                    <h2>{i18n.t('add_green_org')}</h2>
                </div>
            </div>
            <div className="row text-left mt-20">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('name')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                              placeholder={i18n.t('name')} required="required"
                              value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('select_picture')}<span className="red">*</span></label>
                        <input type="file" accept="image/*" className="form-control"
                               required="required"
                               onChange={e => setPicture(e.target.files[0])}/>
                    </div>
                </div>
            </div>
            <div className="row text-left mt-10">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('brief')}<span className="red">*</span></label>
                        <textarea className="form-control" rows={2}
                                  placeholder={i18n.t('brief')} required="required"
                                  value={brief} onChange={e => setBrief(e.target.value)}></textarea>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('details')}<span className="red">*</span></label>
                        <textarea className="form-control" rows={2}
                                  placeholder={i18n.t('details')} required="required"
                                  value={details} onChange={e => setDetails(e.target.value)}></textarea>
                    </div>
                </div>
            </div>
            <div className="row text-left mt-10">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('email')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                               placeholder={i18n.t('email')} required="required"
                               value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('website')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                               placeholder={i18n.t('website')} required="required"
                               value={website} onChange={e => setWebsite(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row text-left mt-10">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('city')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                               placeholder={i18n.t('city')} required="required"
                               value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('street')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                               placeholder={i18n.t('street')} required="required"
                               value={street} onChange={e => setStreet(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row text-left mt-10">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('number')}<span className="red">*</span></label>
                        <input type="number" className="form-control"
                               placeholder={i18n.t('number')} required="required"
                               value={number} onChange={e => setNumber(e.target.value)} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('phone')}<span className="red">*</span></label>
                        <input type="text" className="form-control"
                               placeholder={i18n.t('phone')} required="required"
                               value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                </div>
            </div>
            <div className="row text-right">
                <div className="col">
                    <button type="button" className="btn btn-primary"
                            onClick={handleSave}>{i18n.t('save_changes')}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddGreenOrg);