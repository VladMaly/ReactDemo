import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class FormTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Carl Van Loon',
            secondName: 'Limitless'
        };

        this.setFistName = this.setFistName.bind(this);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.defaultInput).focus();
    }

    setFistName() {
        this.setState(() => ({
            name: 'Eddie Morra'
        }));
        ReactDOM.findDOMNode(this.refs.givenName).focus();

    }

    updateName(e) {
        this.setState({
            name: e.target.value
            // name: this.refs.givenName.value
        });
    }

    updateField(e) {
        this.setState({
            // secondName: e.target.value
            secondName: this.refs.defaultInput.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <h3>The Input field page intends building forms with
                React based lifecycle events, refs, on basic input 
                fields involving update and setting. Also offers as 
                an example in comparison to the next component 'FormPage' 
                which uses HOC to do similar functionality.</h3>
                <input
                    value={this.state.name}
                    ref='givenName'
                    onChange={this.updateName.bind(this)}
                    type="text"
                />

                <input
                    value={this.state.secondName}
                    ref='defaultInput'
                    onChange={this.updateField.bind(this)}
                    type="text"
                />
                
                <button onClick={this.setFistName}>
                    Set Name
                </button>
            </React.Fragment>
        );
    }
}

export default FormTest;
