import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import keys from "../store/keys";
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import postService from '../services/post';
import likeService from '../services/like';
import commentService from '../services/comment';
import {swalDeleteForm, swalError, swalInfo, swalSuccess, swalRemoveLike, swalComment} from '../utils/swal';
import moment from 'moment';
import {NavLink, Redirect} from "react-router-dom";
import PostBox from "./PostBox";

function AllPosts({
                     session,
                     setKey,
                     ...props
                 }) {
    const [redirectTo, setRedirectTo] = useState(null);
    const {i18n} = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        getData(false, false);
    }, []);

    useEffect(() => {
        getData(false, false);
    }, [session.postCreatedRefresh]);

    const getData = async (sortByDate, sortByInteractions) => {
        await postService.getAll(session.token)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    setKey(keys.isLoading, false);
                    return;
                }

                let t = result.data;
                if(sortByDate) {
                    t = result.data.sort((a,b) => new Date(b.date) - new Date(a.date));
                } else if (sortByInteractions) {
                    let dataWithInteractions = result.data.map(k => {
                        let commentsCount = k.comments.length;
                        let likesCount = k.likes.length;
                        return {
                            ...k,
                            interactions: commentsCount + likesCount
                        };
                    });

                    t = dataWithInteractions.sort((a,b) => b.interactions - a.interactions);
                }

                setData(t);
            });
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
                                getData(false, false);
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
                            getData(false, false);
                    });
                }
        });
    }

    const handleOpenPost = postId => {
        setKey(keys.showPost, postId);
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

                    swalSuccess(i18n.t('comment_success'));
                    getData(false, false);
                });
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
                getData(false, false);
            });
    }

    const renderData = () => {
        if (data.length === 0)
            return <tr key="qweroi"><td className="text-center" colSpan="2">{i18n.t('no_data_found')}</td></tr>;

        return data.map(x => {
            let post = x;
            let originalPost = x.originalPostId.length === 1 && x.originalPostId[0] || null;
            let originalUser = x.originalUserId.length === 1 && x.originalUserId[0] || null;

            if (originalPost && originalUser)
                return (<div className="post-box" key={post.userId._id}>
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
                                    <span
                                        className="post-date ml-10">{moment(originalPost.date).format('DD-MMM-YYYY HH:mm A')}</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
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
                </div>)

            if (post)
                return (
                    <div className="post-box" key={post._id}>
                        <div className="row">
                            <div className="col">
                                <NavLink to={`/profile/${post.userId._id}`}>
                                    <img id="img-circle-header" className="img-circle-header"
                                         src={`${post.userId.fileUrl}`}/>
                                    {post.userId.name}
                                    <br/>
                                    <span className="post-date">{moment(post.date).format('DD-MMM-YYYY HH:mm A')}</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
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
                                    {post.hashtags.split(",").map(x => <span key={x}
                                                                             className="badge badge-success m-1">{x}</span>)}
                                </span>
                                <br/>
                                <span>{post.likes.length || 0}</span><i className="fa fa-thumbs-up m-1"
                                                                        onClick={e => handleLike(e, post._id)}></i>
                                <span className="ml-10">{post.comments.length || 0}</span><i
                                className="fa fa-comments m-1" onClick={e => handleComment(e, post._id)}></i>
                                <i className="fa fa-share ml-10" onClick={e => handleShare(e, post._id)}></i>
                            </div>
                        </div>
                    </div>
                )

            // if(x.originalPostId && x.originalPostId[0]) {
            //     return <tr key={x._id} className="public-post text-center">
            //         {/*<td><img src={x.fileUrl} className="post-image" onClick={e => handleOpenPost(x._id)} /></td>*/}
            //         <td colSpan={2}>
            //             <NavLink to={`/profile/${x.userId._id}`}>{x.userId.name}</NavLink> shared this post.
            //             <div style={{border: '1px solid #ddd', padding: '10px', marginTop: '10px'}}>
            //                 <NavLink to={`/profile/${x.userId._id}`}>{x.userId.name}</NavLink>
            //                 <br/>
            //                 <p className="post-text" onClick={e => handleOpenPost(x._id)}>{x.text}</p>
            //                 <img src={x.fileUrl} className="post-image" onClick={e => handleOpenPost(x._id)} /> <br/>
            //                 <span className="post-date">{moment(x.date).format('DD-MMM-YYYY HH:mm A')}</span> <br/>
            //                 <span className="post-hashtags">{x.hashtags.split(",").map(x => <span key={x} className="badge badge-success m-1">{x}</span>)}</span> <br/>
            //                 <span>{x.likes.length || 0}</span><i className="fa fa-thumbs-up m-1" onClick={e => handleLike(e, x._id)}></i>
            //                 <span className="ml-10">{x.comments.length || 0}</span><i className="fa fa-comments m-1" onClick={e => handleComment(e, x._id)}></i>
            //                 <i className="fa fa-share ml-10" onClick={e => handleShare(e, x._id)}></i>
            //             </div>
            //             <span>{x.likes.length || 0}</span><i className="fa fa-thumbs-up m-1" onClick={e => handleLike(e, x._id)}></i>
            //             <span className="ml-10">{x.comments.length || 0}</span><i className="fa fa-comments m-1" onClick={e => handleComment(e, x._id)}></i>
            //             <i className="fa fa-share ml-10" onClick={e => handleShare(e, x._id)}></i>
            //         </td>
            //     </tr>
            // }
            // else {
            //     return <tr key={x._id} className="public-post">
            //         <td><img src={x.fileUrl} className="post-image" onClick={e => handleOpenPost(x._id)} /></td>
            //         <td>
            //             <NavLink to={`/profile/${x.userId._id}`}>{x.userId.name}</NavLink>
            //             <br/>
            //             <p className="post-text" onClick={e => handleOpenPost(x._id)}>{x.text}</p>
            //             <span className="post-date">{moment(x.date).format('DD-MMM-YYYY HH:mm A')}</span> <br/>
            //             <span className="post-hashtags">{x.hashtags.split(",").map(x => <span key={x} className="badge badge-success m-1">{x}</span>)}</span> <br/>
            //             <span>{x.likes.length || 0}</span><i className="fa fa-thumbs-up m-1" onClick={e => handleLike(e, x._id)}></i>
            //             <span className="ml-10">{x.comments.length || 0}</span><i className="fa fa-comments m-1" onClick={e => handleComment(e, x._id)}></i>
            //             <i className="fa fa-share ml-10" onClick={e => handleShare(e, x._id)}></i>
            //         </td>
            //     </tr>
            // }
        });
    }

    const handleSortByDate = e => {
        e.preventDefault();
        getData(true, false);
    }

    const hanldeSortByInteractions = e => {
        e.preventDefault();
        getData(false, true);
    }

    return (
        <div className="container">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row mt-20">
                <div className="col">
                    <span className="h2">{i18n.t('all_posts')}</span>
                    <button className="btn btn-sm btn-light ml-10" onClick={handleSortByDate}>{i18n.t('sort_by_date')}</button>
                    <button className="btn btn-sm btn-light ml-10" onClick={hanldeSortByInteractions}>{i18n.t('sort_by_interactions')}</button>
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12">
                    {renderData()}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);