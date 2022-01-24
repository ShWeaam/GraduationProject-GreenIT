import React, {useState, useEffect} from 'react';
import postService from '../services/post';
import {NavLink, Redirect} from 'react-router-dom';
import moment from "moment";
import {swalDeleteForm, swalError, swalSuccess, swalRemoveLike, swalShare, swalComment, swalInfo} from "../utils/swal";
import likeService from "../services/like";
import commentService from "../services/comment";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import utils from "../utils/utils";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

function PostPage({
                      session,
                      setKey,
                      ...props
                  }) {

    const {i18n} = useTranslation();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        reloadPost();
    }, []);

    const reloadPost = () => {
        let id = session.showPost || null;
        if(id) {
            postService.getById(session.token, id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length === 1)
                        setPost(result.data[0]);
                });
        }
    }

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
                    swalRemoveLike(i18n.t('already_liked_want_to_remove'), i18n.t('save_changes'), i18n.t('cancel'), () => {
                        likeService.delete(session.token, postId)
                            .then(result => {
                                if (result.error) {
                                    swalError(result.error);
                                    return;
                                }

                                swalSuccess(i18n.t('like_removed_success'));
                                reloadPost();
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
                            reloadPost();
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
                    reloadPost();
                });
        });
    }

    const renderComments = () => {
        if (post.comments.length === 0)
            return <div>{i18n.t('no_data_found')}</div>;

        return post.comments.sort((a, b) => moment(b.date) - moment(a.date)).map(x => {
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
                reloadPost();
            });
    }

    if(post)
    return (
        <Rodal visible={session.showPost ? true : false}
               onClose={() => setKey(keys.showPost, null)}
               closeOnEsc={false}
               closeMaskOnClick={false}
               customStyles={utils.rodalPostPage()}>
            <div className="container post-page">
                <div className="row">
                    <div className="col">
                        <NavLink to={`/profile/${post.userId._id}`}>
                            <img id="img-circle-header" className="img-circle-header"
                                 src={`${post.userId.fileUrl}`}/>
                            {post.userId.name}
                            <br/>
                            <span className="post-date ml-10">{moment(post.userId.date).format('DD-MMM-YYYY HH:mm A')}</span>
                        </NavLink>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="post-text">{post.text}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <img src={post.fileUrl} className="post-image"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                         <br/>
                        <span className="post-hashtags">{post.hashtags.split(",").map(x => <span
                            className="badge badge-success m-1">{x}</span>)}</span> <br/>
                        <span>{post.likes.length || 0}</span><i className="fa fa-thumbs-up m-1"
                                                                onClick={e => handleLike(e, post._id)}></i>
                        <span className="ml-10">{post.comments.length || 0}</span><i className="fa fa-comments m-1"
                                                                                     onClick={e => handleComment(e, post._id)}></i>
                        <i className="fa fa-share ml-10" onClick={e => handleShare(e, post._id)}></i>
                    </div>
                </div>
                <div className="row text-left mt-30">
                    <div className="col">
                        <h5>{i18n.t('comments')}</h5>
                        <ul className="comments">
                            {renderComments()}
                        </ul>
                    </div>
                </div>
            </div>
        </Rodal>
    )
    else
        return <div>Loading...</div>
}


const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);