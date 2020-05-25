import { View, Platform, StyleSheet, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar,  } from 'react-native-gifted-chat'
import NetInfo from '@react-native-community/netinfo'
import React, { Component } from 'react';
import CustomActions from './CustomActions';
import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
import MapView from 'react-native-maps';


const firebase = require('firebase');
require('firebase/firestore');

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError (error) {
        return { hasError: true }
    }

    componentDidCatch (error, info) {
        logErrorToService(error, info.componentStack)
    }

    render () {
        return this.state.hasError
            ? <FallbackComponent />
            : this.props.children
    }
}

export default class Chat extends Component {
    constructor() {
        super();
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyBEGz1m8rYEffkvaBT6gtlu8TuMg3y5ft8",
                authDomain: "messages-43f57.firebaseapp.com",
                databaseURL: "https://messages-43f57.firebaseio.com",
                projectId: "messages-43f57",
                storageBucket: "messages-43f57.appspot.com",
                messagingSenderId: "455607618071",
                appId: "1:455607618071:web:7c4ccb5d548b9070e6ea52"
            });
        }

        this.referenceChatUser = null;

        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.state = {
            messages: [],
            isOnline: false,
            uid: 0,
            startTime: new Date(), //(new Date()).toISOString(),
            loggedInText: 'Please wait, you are getting logged in',
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        let messages = [];
        // go through each document
        let count = 0;
        querySnapshot.forEach((doc) => {
            count++;
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            //if (!data._id) console.log("missing id: " + JSON.stringify(data) );
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                image: data.image,
                location: data.location
            });
        });
        //messages = messages.filter((i) => {return new Date(i.createdAt) > this.state.startTime});
        messages = messages.sort((a,b) => { return b.createdAt - a.createdAt });
        this.setState({
            messages: messages
        },() => {
            this.saveMessages();
        });
    };

    addMessage(message) {
        this.referenceChatMessages.add(message);
    }

    // Name for nav
    static navigationOptions = ({ navigation }) => {
        return {title: navigation.state.params.name}
    };

    state = {
        messages: []
    };

    // upload image to Storage with XMLHttpRequest
    uploadImage = async(uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function(e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child('my-image');

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    // Adding message props
    componentDidMount() {

        let isOnline;

        NetInfo.fetch().then(state => {

            this.setState({isOnline: state.isConnected});
            isOnline = state.isConnected;

            if (state.isConnected) {
                console.log('online');
            } else {
                console.log('offline');
            }

            if (!isOnline) {
                this.getMessages();
            } else {

                // listen to authentication events
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                        return;
                    }

                    //update user state with currently active user data
                    this.setState({
                        uid: user.uid,
                        //loggedInText: 'Hello there',
                    });


                    //this.unsubscribeChatUser = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

                    // create a reference to the active user's documents (chat messages)
                    this.referenceChatUser = firebase.firestore().collection('messages');
                    // .where("user.uid", "==", user.uid)
                    // listen for collection changes for current user
                    this.unsubscribeChatUser = this.referenceChatUser.onSnapshot(this.onCollectionUpdate);
                });
            }

        });


    }

    componentWillUnmount() {
        if (this.state.isOnline) {
            // stop listening to authentication
            this.authUnsubscribe();
            // stop listening for changes
            this.unsubscribeChatUser();
        }
    }

    // Read messages in storage

    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // Called when user sends a message

    onSend(messages = []) {
        messages.forEach((message) => this.addMessage(message));
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView (props) {
        const { currentMessage} = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3}}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }


    //Changes background color of message bubble

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    // Disables new messages when offline

    renderInputToolbar(props) {
        if (this.state.isOnline == false) {
        } else {
            return(
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    render() {
        return (

            <View style={{backgroundColor: this.props.navigation.state.params.color, flex: 1}}>

                <GiftedChat
                    //key={this.state._id}
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.uid,
                    }}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 40,
    },
    item: {
        fontSize: 20,
        color: 'blue',
    },
    text: {
        fontSize: 30,
    }
});
