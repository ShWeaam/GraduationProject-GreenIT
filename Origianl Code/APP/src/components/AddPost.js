import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import Select from "react-select";
import utils from "../utils/utils";

function AddPost({
                           session,
                           setKey,
                           setStringifiedKey,
                           getKey,
                           ...props
                       }) {
    const {i18n} = useTranslation();
    const [text, setText] = useState('');
    const [picture, setPicture] = useState(null);
    const [hashtags, setHashtags] = useState(null);
    const [preselectedFile, setPreselectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hashtagOptions, setHashtagOptions] = useState(utils.getHashtags(session.language));

    useEffect(() => {
       const postId = window.location.href.split("/").pop();
       if(postId && postId.length === 24) {
           postService.getById(session.token, postId)
               .then(result => {
                   if (result.error) {
                       setErrorMessage(result.error);
                       setKey(keys.isLoading, false);
                       return;
                   }

                   let data = result.data[0];
                   setText(data.text);
                   setPreselectedFile(data.fileUrl);
                   if(data.hashtags) {
                       let f = [];
                       data.hashtags.split(",").map(k => {
                           k = k.trim();
                           f.push(utils.getHashtags(session.language).find(y => y.value === k));
                       });
                       setHashtags(f);
                   }
               });
       }
    }, []);

    const handleSave = async e => {
        e.preventDefault();

        if(!text || !hashtags) {
            setErrorMessage(i18n.t('provide_all_fields'));
            return;
        }

        setKey(keys.isLoading, true);
        const recordId = window.location.href.split("/").pop();
        if(recordId && recordId.length === 24) {
            let t = hashtags.map(k => k.value).join(', ');
            await postService.update(session.token, recordId, text, picture, t)
                .then(result => {
                    if (result.error) {
                        setErrorMessage(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }

                    setKey(keys.isLoading, false);
                    setErrorMessage('');
                    setSuccessMessage(i18n.t('data_update_success'));
                });
        }
        else {
            
            let t = hashtags.map(k => k.value).join(', ');
            await postService.create(session.token, text, picture, t)
                .then(result => {
                    if (result.error) {
                        setErrorMessage(result.error);
                        setKey(keys.isLoading, false);
                        return;
                    }

                    setKey(keys.isLoading, false);
                    setErrorMessage('');
                    setSuccessMessage(i18n.t('data_add_success'));
                    setKey(keys.postCreatedRefresh, true);
                    clearForm();
                });
        }
    }

    const clearForm = () => {
        setText(``);
        setPreselectedFile(null);
        setHashtags(null);
        setPicture(null);
        setErrorMessage("");
        setSuccessMessage("");
    }

    return (
        <div className="container">
            <div className="row mt-20">
                <div className="col">
                    <h2>{ window.location.href.split("/").pop().length === 24 ? i18n.t('update_post') : i18n.t('add_post')}</h2>
                </div>
            </div>
            <div className="row text-left mt-20">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('text')}<span className="red">*</span></label>
                        <textarea className="form-control" rows={2}
                                  placeholder={i18n.t('text')} required="required"
                                  value={text} onChange={e => setText(e.target.value)}></textarea>
                    </div>
                </div>
            </div>
            <div className="row text-left">
                <div className="col">
                    <div className="form-group">
                        <label>{i18n.t('select_picture')}</label>
                        <input type="file" accept="image/*" className="form-control"
                               onChange={e => setPicture(e.target.files[0])}/>
                        <br/>
                        {preselectedFile && <a target="_blank" href={preselectedFile}>{i18n.t('selected_picture')}</a>}
                    </div>
                </div>
                <div className="col">
                    <label>{i18n.t('select_hashtags')}</label>
                    <Select options={hashtagOptions} isMulti={true}
                            defaultValue={hashtags} value={hashtags} onChange={setHashtags} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);