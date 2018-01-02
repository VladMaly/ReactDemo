import React, { Component } from 'react';

function InputField(defaultInput, customClickEvent = null) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                startingInput: defaultInput
            };
        }

        updateField(e) {
            this.setState({
                startingInput: e.target.value
            });
        }

        clickEvent(e) {
            if (customClickEvent == null) {
                this.setState({
                    startingInput: e.target.value + 'Extra'
                });
            } else {
                console.log(customClickEvent(e.target.value));
                this.setState({
                    startingInput: customClickEvent(e.target.value)
                });
            }
        }

        render() {
            return (
                <React.Fragment>
                    <input
                        type="text"
                        value={this.state.startingInput}
                        onChange={this.updateField.bind(this)}
                        onClick={this.clickEvent.bind(this)}
                    />
                </React.Fragment>
            );
        }
    }
}

function CustomClickEvent1(currText) {
    return currText + 'CustomExtra';
}

function InputFields() {
    const FieldHOC = InputField('Carl Van Loon', CustomClickEvent1);
    const FieldHOC2 = InputField('Limitless');
    const FieldHOC3 = InputField('Call Me Ishmael', (currText) => ('Moby Dick'));
    return (
        <React.Fragment>
            <h3>
                The InputHOC intends to show HOC(Higher Order Components)
                    in comparison to the link above. Added custom click events to two 
                    of the input fields referenced from outside the class.
            </h3>
            <FieldHOC />
            <FieldHOC2 />
            <FieldHOC3 />
        </React.Fragment>
    );
}

export default InputFields;
