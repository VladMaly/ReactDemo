import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import linkList from '../consts/LinkList';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        let currLocation = props.location.pathname;

        this.state = {
            isLost: this.checkIfMatch(currLocation),
            path: currLocation
        };

    }

    checkIfMatch(location) {
        let matchesSomePath = false;
        if (location == "/") {
            matchesSomePath = true;
        }
        else {
            for (let i = 0; i < linkList.length; i++) {
                if (('/' + linkList[i].linkTo) == location) {
                    matchesSomePath = true;
                }
            }
        }
        return matchesSomePath;
    }

    componentWillReceiveProps(nextProps) {
        // Render is invoked every time that the props change.
        if (nextProps.location.pathname !== this.state.path) {
            this.setState({ isLost:  this.checkIfMatch(nextProps.location.pathname) });
        }
    }

    render() {
        return (
                <React.Fragment>
                    {!this.state.isLost && <h1>Not Found. 404</h1>}
                </React.Fragment>
        );
    }
}

export default NotFound;
