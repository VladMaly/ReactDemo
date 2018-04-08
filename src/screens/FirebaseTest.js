import React, { Component, Image } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

class FirebaseTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfClients: []
        };
        this.dataBackup = [];
    }
    componentDidMount() {
        const rootRef = firebase.database().ref().child("users");
        const infoRef = rootRef.child('info');
        const filterData = infoRef.orderByChild("isAccountTypeClient").equalTo(false).limitToLast(100);
        filterData.once('value')
        .then((snapshot) => {
            let dataTemp = [];
            snapshot.forEach((item) => {
                let initials = item.val().name.match(/\b\w/g) || [];
                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                dataTemp.push({
                    uid: item.key,
                    name: item.val().name,
                    nickname: initials,
                    email: item.val().email,
                    portfolioUri: ''
                });
            });
            this.dataBackup = dataTemp;
            this.loadImages();
            // this.setState({ listOfClients: dataTemp });
        })
        .catch((error) => {
            // this.setState({ status: error.message });
        })
    }
    loadImages() {
        this.counter = 0;
        for (let i = 0; i < this.dataBackup.length; i++) {
          const rootRefStorage = firebase.storage().ref('Data');
          const userRefStorage = rootRefStorage.child(this.dataBackup[i].uid);
          const profilePicRefStorage = userRefStorage.child('ProfilePictures');
          const imageRefStorage = profilePicRefStorage.child('profilePic');
          imageRefStorage.getDownloadURL()
          .then((url) => {
            this.counter++;
            this.dataBackup[i].portfolioUri = url;
            if (this.counter == this.dataBackup.length) {
              this.loadImagesFinalDestination();
            }
          })
          .catch((error) => {
            this.counter++;
            this.setState({ status: error.message });
            if (this.counter == this.dataBackup.length) {
              this.loadImagesFinalDestination();
            }
          });
        }
    }
    loadImagesFinalDestination() {
        this.setState({ listOfClients: this.dataBackup });
    }
    render() {
        return (
            <React.Fragment>
                <h3>Firebase Test.</h3>
                <h4>List all the client's names from firebase database below:</h4>

                <div style={{marginLeft: '30px'}}>
                    {this.state.listOfClients.length != 0 ?
                        <div>
                            {this.state.listOfClients.map((client) =>
                                <div style={{border: '1px solid black', padding: '10px', margin: '10px'}} key={client.email}>
                                    {client.portfolioUri != '' ?
                                        <img src={ client.portfolioUri } style={{ width: '60px', height: '60px' }}/>
                                    :
                                        <div style={{ width: '60px', height: '60px', border: '1px solid black'}}>{client.nickname}</div>
                                    }
                                    <div>Name: {client.name}, Email: {client.email}</div>
                                </div>
                            )}
                        </div>
                    :
                        <div>
                            <h5>There are no clients at the moment.</h5>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default FirebaseTest;
