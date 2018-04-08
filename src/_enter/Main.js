import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { IndexRoute, browserHistory } from 'react-router';
import './styles.css';

import HomePageText from '../screens/Home';
import { Characters, charList } from '../screens/Characters';
import FormTest from '../screens/FormTest';
import SqlTest from '../screens/SqlTest';
import InputFields from '../screens/InputFields';
import FirebaseTest from '../screens/FirebaseTest';
import FirestoreTest from '../screens/FirestoreTest';
import NotFound from '../screens/NotFound';
import firebase from 'firebase';

import linkList from '../consts/LinkList';


class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <Router>
                    <React.Fragment>
                        <h1 className="heading">Welcome. This is a React Project.</h1>
                        <div>
                            <div className="container-over-boxes">
                                <div className="align-left left-side-width">
                                    <div className="left-main main">
                                        {linkList.map((link) =>
                                            <Link to={link.linkTo} key={link.id}>
                                                <h3>{link.linkName}</h3>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="right-main main right-side-width">
                                    <Route path='*' component={NotFound}/>
                                    <Route path={'/Characters'} component={Characters}/>
                                    <Route path={'/InputFieldsTest'} component={FormTest}/>
                                    <Route path={'/HigherOrderComponents'} component={InputFields}/>
                                    <Route path={'/FirebaseTest'} component={FirebaseTest}/>
                                    <Route path={'/FirestoreTest'} component={FirestoreTest}/>
                                    <Route path={'/SqlTest'} component={SqlTest}/>
                                    <Route exact={true} path="/" component={HomePageText}/>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </Router>
            </React.Fragment>
        )
    }
}

export default Main;
