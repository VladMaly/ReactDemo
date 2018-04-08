import React, { Component, Image } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
// Required for side-effects
require("firebase/firestore");

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBNwKakeSJ2pJPufMH7jvSEK-0Cq70I6EU",
    authDomain: "caterpalacetest.firebaseapp.com",
    databaseURL: "https://caterpalacetest.firebaseio.com",
    projectId: "caterpalacetest",
    storageBucket: "gs://caterpalacetest.appspot.com",
    messagingSenderId: "536293245368"
};

firebase.initializeApp(FIREBASE_CONFIG);

var db = firebase.firestore();

class FirestoreTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfClients: [],
            name: '',
            chosenImage: ''
        };
        this.dataBackup = [];
    }
    componentDidMount() {
        db.collection("users").get().then((querySnapshot) => {
            let newData = [];
            querySnapshot.forEach((doc) => {
                // console.log(`${doc.id} => ${doc.data()}`);
                let name = doc.data().name;
                let initials = name.match(/\b\w/g) || [];
                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                
                newData.push({
                    uid: doc.id,
                    name: name,
                    portfolioUri : '',
                    nickname: initials
                })

                this.dataBackup = newData;
                this.loadImages();
                // this.setState({ listOfClients: newData });
            });
        });
        // const rootRef = firebase.database().ref().child("users");
        // const infoRef = rootRef.child('info');
        // const filterData = infoRef.orderByChild("isAccountTypeClient").equalTo(false).limitToLast(100);
        // filterData.once('value')
        // .then((snapshot) => {
        //     let dataTemp = [];
        //     snapshot.forEach((item) => {
        //         let initials = item.val().name.match(/\b\w/g) || [];
        //         initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        //         dataTemp.push({
        //             uid: item.key,
        //             name: item.val().name,
        //             nickname: initials,
        //             email: item.val().email,
        //             portfolioUri: ''
        //         });
        //     });
        //     this.dataBackup = dataTemp;
        //     this.loadImages();
        //     // this.setState({ listOfClients: dataTemp });
        // })
        // .catch((error) => {
        //     // this.setState({ status: error.message });
        // })
    }
    loadImages() {
        this.counter = 0;
        for (let i = 0; i < this.dataBackup.length; i++) {
          const rootRefStorage = firebase.storage().ref('NewData');
          const userRefStorage = rootRefStorage.child(this.dataBackup[i].uid);
          const profilePicRefStorage = userRefStorage.child('ProfilePictures');
          const imageRefStorage = profilePicRefStorage.child('profileImg');
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
            // this.setState({ status: error.message });
            if (this.counter == this.dataBackup.length) {
              this.loadImagesFinalDestination();
            }
          });
        }
    }
    loadImagesFinalDestination() {
        this.setState({ listOfClients: this.dataBackup });
    }
    uploadImageToStorage(uri, imageName, uid, mime = 'image/jpg') {
        // return new Promise((resolve, reject) => {
            // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            // let uploadBlob = null
            // // Save the collected image as the 
            const rootRef = firebase.storage().ref('NewData');
            const userRef = rootRef.child(uid);
            const profilePicRef = userRef.child('ProfilePictures');
            const imageRef = profilePicRef.child(imageName);
            imageRef.put(this.dataURItoBlob(uri), { contentType: mime })
            .then(function(snapshot) {
                console.log('Uploaded a blob or file!');
            })
            .catch(() =>{
                console.log('Failed Upload!');
            })
            // const imageRef = firebaseApp.storage().ref('posts').child(imageName)
            // fs.readFile(uploadUri, 'base64')
            // .then((data) => {
            //   return Blob.build(data, { type: `${mime};BASE64` })
            // })
            // .then((blob) => {
            //   uploadBlob = blob
            //   return imageRef.put(blob, { contentType: mime })
            // })
            // .then(() => {
            //   uploadBlob.close()
            //   // return imageRef.getDownloadURL()
            // })
            // .then((url) => {
            //   resolve(url)
            // })
            // .catch((error) => {
            //   reject(error)
            // })
        // })
    }
    addNewUser() {
        let newName = this.state.name;
        db.collection("users").add({
            name: newName
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            this.uploadImageToStorage(this.state.chosenImage, 'profileImg', docRef.id);

            let tempList = this.state.listOfClients;
            let initials = newName.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            let newObj = {
                uid: docRef.id,
                name: newName,
                portfolioUri: this.state.chosenImage,
                nickname: initials
            }
            tempList.push(newObj);
            this.setState({ name: '', chosenImage: '', listOfClients: tempList });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }
    onReadImage(event) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({chosenImage: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    render() {
        return (
            <React.Fragment>
                <h3>Firebase Test.</h3>
                <h4>List all the client's names from firebase database below:</h4>
                <div>
                    <button
                        style={{ backgroundColor: 'Orange', color: 'white' }}
                        onClick={this.addNewUser.bind(this)}>
                            Add user
                    </button>
                    <input
                        value={this.state.name}
                        placeholder='Enter name of new user'
                        onChange={(e) => this.setState({ name: e.target.value })}
                        type="text"
                    />
                    <input id="upload" ref="upload" type="file" accept="image/*"
                            onChange={this.onReadImage.bind(this)}
                            // onClick={(event)=> { 
                            //     event.target.value = null
                            // }}
                    />
                    <div>
                        <img style={this.state.chosenImage != '' ? {width: '200px', height: '200px'} : {}}
                        src={this.state.chosenImage}
                        />
                    </div>
                </div>

                <div style={{marginLeft: '30px'}}>
                    {this.state.listOfClients.length != 0 ?
                        <div>
                            {this.state.listOfClients.map((client) =>
                                <div style={{border: '1px solid black', padding: '10px', margin: '10px'}} key={client.uid}>
                                    {client.portfolioUri != '' ?
                                        <img src={ client.portfolioUri } style={{ width: '60px', height: '60px' }}/>
                                    :
                                        <div style={{ width: '60px', height: '60px', border: '1px solid black'}}>{client.nickname}</div>
                                    }
                                    <div>Name: {client.name}</div>
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

export default FirestoreTest;
