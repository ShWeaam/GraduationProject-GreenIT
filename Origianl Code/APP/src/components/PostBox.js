import React, {useState, useEffect} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import Select from "react-select";
import utils from "../utils/utils";
import moment from "moment";
import {swalComment, swalError, swalInfo, swalRemoveLike, swalSuccess} from "../utils/swal";
import likeService from "../services/like";
import commentService from "../services/comment";

function PostBox({
                     session,
                     setKey,
                     setStringifiedKey,
                     getKey,
                     ...props
                 }) {
    const {i18n} = useTranslation();
    const [post, setPost] = useState(null);
    const [originalPost, setOriginalPost] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);

    useEffect(() => {
        setPost(props.post);
        if(props.post.originalPost && props.post.originalPost) {
            setOriginalPost(props.post.originalPost);
            setOriginalUser(props.post.originalUser);
        }
    }, []);

    const handleLike = (e, postId) => {
        e.preventDefault();
        if (!session.token) {
            swalInfo(i18n.t('login_first'));
            return;
        }

        likeService.check(session.token, postId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                if (result.data.length > 0) {
                    swalRemoveLike(i18n.t('already_liked_want_to_remove'), i18n.t('save_changes'),i18n.t('cancel'), () => {
                        likeService.delete(session.token, postId)
                            .then(result => {
                                if (result.error) {
                                    swalError(result.error);
                                    return;
                                }

                                swalSuccess(i18n.t('like_removed_success'));
                                props.reload();
                            });
                    });
                } else {
                    likeService.add(session.token, postId)
                        .then(result => {
                            if (result.error) {
                                swalError(result.error);
                                return;
                            }

                            swalSuccess(i18n.t('like_success'));
                            props.reload();
                        });
                }
            });
    }

    const handleComment = (e, postId) => {
        e.preventDefault();
        if (!session.token) {
            swalInfo(i18n.t('login_first'));
            return;
        }

        swalComment(i18n.t('add_comment'), i18n.t('save_changes'), i18n.t('cancel'), comment => {
            commentService.add(session.token, postId, comment)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    swalSuccess(i18n.t('data_added_success'));
                    props.reload();
                });
        });
    }

    const renderComments = () => {
        if (props.post.comments.length === 0)
            return <div>{i18n.t('no_data_found')}</div>;

        return props.post.comments.sort((a, b) => moment(b.date) - moment(a.date)).map(x => {
            return (
                <li>
                    {x.text} <br/>
                    <span className="post-date">{moment(x.date).format('DD-MMM-YYYY')}</span>
                </li>
            );
        });
    }

    const handleShare = (e, postId) => {
        e.preventDefault();
        if (!session.token) {
            swalInfo(i18n.t('login_first'));
            return;
        }

        postService.share(session.token, postId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                swalSuccess(i18n.t('post_share_success'));
                props.reload();
            });
    }

    const handleOpenPost = postId => {
        setKey(keys.showPost, postId);
    }

    return (
        <div className="container-fluid post-box">
            {
                originalPost &&
                <>
                    <div className="row">
                        <div className="col">
                            <NavLink to={`/profile/${post.userId._id}`}>
                                <img id="img-circle-header" className="img-circle-header"
                                     src={`${post.userId.fileUrl}`}/>
                                {post.userId.name}
                            </NavLink> {i18n.t('shared_this_post')}
                        </div>
                    </div>
                    <div className="shared-post">
                        <div className="row">
                            <div className="col">
                                <NavLink to={`/profile/${originalUser._id}`}>
                                    <img id="img-circle-header" className="img-circle-header"
                                         src={`${originalUser.fileUrl}`}/>
                                    {originalUser.name}
                                    <br/>
                                    <span className="post-date ml-10">{moment(originalPost.date).format('DD-MMM-YYYY HH:mm A')}</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <p className="post-text"
                                   onClick={e => handleOpenPost(originalPost._id)}>{originalPost.text}</p>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <img src={originalPost.fileUrl} className="post-image"
                                     onClick={e => handleOpenPost(originalPost._id)}/> <br/>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <span className="post-hashtags">{originalPost.hashtags.split(",").map(tag =>
                                    <span key={tag} className="badge badge-success m-1">{tag}</span>)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="col">
                            <span>{post.likes.length || 0}</span>
                            <i className="fa fa-thumbs-up m-1" onClick={e => handleLike(e, post._id)}></i>
                            <span className="ml-10">{post.comments.length || 0}</span>
                            <i className="fa fa-comments m-1" onClick={e => handleComment(e, post._id)}></i>
                            <i className="fa fa-share ml-10" onClick={e => handleShare(e, post._id)}></i>
                        </div>
                    </div>
                </>
            }
            {
                post &&
                    <>
                        <div className="row">
                            <div className="col">
                                <NavLink to={`/profile/${post.userId._id}`}>
                                    <img id="img-circle-header" className="img-circle-header" src={`${props.post.userId.fileUrl}`}/>
                                    {post.userId.name}
                                    <br/>
                                    <span className="post-date">{moment(post.date).format('DD-MMM-YYYY HH:mm A')}</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <p className="post-text"
                                   onClick={e => handleOpenPost(post._id)}>{post.text}</p>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <img src={post.fileUrl} className="post-image"
                                     onClick={e => handleOpenPost(post._id)}/> <br/>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <span className="post-hashtags">
                                    {post.hashtags.split(",").map(x => <span key={x} className="badge badge-success m-1">{x}</span>)}
                                </span>
                                <br/>
                                <span>{post.likes.length || 0}</span><i className="fa fa-thumbs-up m-1" onClick={e => handleLike(e, post._id)}></i>
                                <span className="ml-10">{post.comments.length || 0}</span><i
                                className="fa fa-comments m-1" onClick={e => handleComment(e, post._id)}></i>
                                <i className="fa fa-share ml-10" onClick={e => handleShare(e, post._id)}></i>
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
    setKey: (key, value) => dispatch(setKey(key, value)),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostBox);