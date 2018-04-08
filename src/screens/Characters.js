import React, { Component } from 'react';


const charList = [
    {id : 1, name: 'Queen Cersei', from: 'Game of Thrones'},
    {id : 2, name: 'Adrian Veidt(Ozymandias)', from: 'Watchmen'},
    {id : 3, name: 'Scott Pilgrim', from:'Scott pilgrim against the world'}
];

function Wrapper(props) {
    return (
        <div style={{border: '1px solid rgb(97, 218, 251)', marginTop: '5px',  padding: '5px'}}>
            {props.children}
        </div>
    );

}

function Details(props) {
    if (!props.show) {
        return null;
    }

    return (
        <div>- {props.data}</div>
    );

}

class Characters extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            charList: charList,
            showDetails: false
        };
        this.styleAttrs = {color: 'rgb(97, 218, 251)', backgroundColor: 'black', fontWeight: 'bold'};
        this.toggleShowDetails = this.toggleShowDetails.bind(this);
    }

    toggleShowDetails() {
        this.setState(prevState => ({
            showDetails: !prevState.showDetails
        }));

        // I used arrow function above, could have also been written using a function, as commented out below

        // this.setState(function (prevState) {
        //     let newState = prevState;
        //     newState.showAll = !newState.showAll;
        //     return {
        //         newState
        //     }
        // });

    }
    render() {
        return (
            <React.Fragment>
                 <h3>
                    The DataSet page intends to show inline conditioning, handling events, spread attributes, 
                    and Tranclusion/Wrapping around the contents.
                </h3>
                <button 
                    style={{...this.styleAttrs}}
                    onClick={this.toggleShowDetails}>
                        Show More Details
                </button>
                <Wrapper id='wrapperElm'>
                    <h2>{this.state.charList.length > 0 ? 'Click on button to see more info.' : 'There is no data.'}</h2>
                        {this.state.charList.length > 0 && this.state.charList.map((character) =>
                            <div key={character.id}>
                                <div>{character.name}</div><Details show={this.state.showDetails} data={character.from}></Details>
                            </div>
                        )}
                </Wrapper> 
            </React.Fragment>
        );
    }
}

export {
    Characters,
    Wrapper,
    charList
}