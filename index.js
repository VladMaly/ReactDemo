import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {IndexRoute, browserHistory} from 'react-router';
import HomePageText from './src/Home';
import './index.css';
import {Characters, charList} from './src/Characters';
import FormTest from './src/FormTest';
import InputFields from './src/InputFields';
import NotFound from './src/NotFound';
import linkList from './src/LinkList';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
// import './node_modules/bootstrap/dist/css/bootstrap.min.css';
// import './node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css'

// <React.Fragment>
//     <App />
//     <HomePageText />
//     <Characters list={charList}></Characters>
//     <FormTest />
//     <InputFields />
// </React.Fragment>

ReactDOM.render(
    <Router>
        <React.Fragment>
            <h1 class="heading">Welcome. This is a React Project.</h1>
            <div class="container">
                <div class="row">
                    <div class="left-main main col-md-4">
                        {linkList.map((link) =>
                            <Link to={link.linkTo} key={link.id}>
                                <h3>{link.linkName}</h3>
                            </Link>
                        )}
                    </div>
                    <div class="right-main main col-md-8">
                        <Route path='*' component={NotFound}/>
                        <Route path={'/Characters'} component={Characters}/>
                        <Route path={'/InputFieldsTest'} component={FormTest}/>
                        <Route path={'/HigherOrderComponents'} component={InputFields}/>
                        <Route exact={true} path="/" component={HomePageText}/> 
                        {/* <HomePageText /> */}
                        {/* <Characters list={charList}></Characters>
                        <FormTest />
                        <InputFields /> */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    </Router>
,document.getElementById('root'));
