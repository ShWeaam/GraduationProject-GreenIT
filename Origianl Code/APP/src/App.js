import React, {useEffect, useState, Suspense} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import keys from "./store/keys";
import {setKey, getKey, clearKeys} from './store/actions';
import GreenOrg from "./components/GreenOrg";
import MyCalendar from "./components/Calendar";
import {Calendar} from "react-big-calendar";
const Header = React.lazy(() => import('./components/Header'));
const Login = React.lazy(() => import('./components/Login'));
const Loading = React.lazy(() => import('./components/Loading'));
const Signup = React.lazy(() => import('./components/Signup'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const ResetNewPassword = React.lazy(() => import('./components/ResetNewPassword'));
const Profile = React.lazy(() => import('./components/Profile'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const ProfileEdit = React.lazy(() => import('./components/ProfileEdit'));
const AddSupervisor = React.lazy(() => import('./components/AddSupervisor'));
const Supervisors = React.lazy(() => import('./components/Supervisors'));
const SignupRequests = React.lazy(() => import('./components/SignupRequests'));
const AddMetric = React.lazy(() => import('./components/AddMetric'));
const Metrics = React.lazy(() => import('./components/Metrics'));
const Settings = React.lazy(() => import('./components/Settings'));
const Home = React.lazy(() => import('./components/Home'));
const Footer = React.lazy(() => import('./components/Footer'));
const CompareMetrics = React.lazy(() => import('./components/CompareMetrics'));
const MyPosts = React.lazy(() => import('./components/MyPosts'));
const AddPost = React.lazy(() => import('./components/AddPost'));
const PostPage = React.lazy(() => import('./components/PostPage'));
const Tips = React.lazy(() => import('./components/Tips'));
const AddGreenOrg = React.lazy(() => import('./components/AddGreenOrg'));

function App({
                 session,
                 setKey
             }) {

    return (
        <BrowserRouter>
            {session.isLoading && <Loading/>}
            {session.showLogin && <Login/>}
            {session.showSignup && <Signup/>}
            {session.showResetPassword && <ResetPassword/>}
            {session.showPost && <PostPage />}
            <Header/>
            <div className="page-body">
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/my-profile' component={Profile}/>
                    <Route exact path='/profile/:userId' component={UserProfile}/>
                    <Route exact path='/edit-profile' component={ProfileEdit}/>
                    <Route exact path='/settings' component={Settings}/>
                    <Route exact path='/supervisors-new' component={AddSupervisor}/>
                    <Route exact path='/supervisors' component={Supervisors}/>
                    <Route exact path='/signup-requests' component={SignupRequests}/>
                    <Route exact path='/metrics-compare' component={CompareMetrics}/>
                    <Route path='/metrics-new' component={AddMetric}/>
                    <Route exact path='/metrics' component={Metrics}/>
                    <Route path='/posts-new' component={AddPost}/>
                    <Route exact path='/my-posts' component={MyPosts}/>
                    {/*<Route path='/posts/:postId' component={PostPage}/>*/}
                    <Route path='/rp' component={ResetNewPassword}/>
                    <Route path='/tips' component={Tips}/>
                    <Route exact path='/green' component={GreenOrg}/>
                    <Route exact path='/add-org' component={AddGreenOrg}/>
                    <Route exact path='/calendar'>
                        <div style={{height: '90vh'}}>
                            <MyCalendar />
                        </div>
                    </Route>
                </Switch>
        </div>
    <Footer/>
</BrowserRouter>
);
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    getKey: key => dispatch(getKey(key)),
    clearKeys: () => dispatch(clearKeys())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
