import { View, Platform, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import React, { Component } from 'react';

import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

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
            uid: 0,
            startTime: new Date(), //(new Date()).toISOString(),
            loggedInText: 'Please wait, you are getting logged in',
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        let messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                image: data.image,
                location: data.location
            });
        });
        messages = messages.filter((i) => {return new Date(i.createdAt) > this.state.startTime});
        messages = messages.sort((a,b) => { return b.createdAt - a.createdAt });
        this.setState({
            messages: messages
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

    // Adding message props
    componentDidMount() {
        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
                return;
            }

            //update user state with currently active user data
            this.setState({
                uid: user.uid,
                loggedInText: 'Hello there',
            });

            //this.unsubscribeChatUser = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

            // create a reference to the active user's documents (chat messages)
            this.referenceChatUser = firebase.firestore().collection('messages');
            // .where("user.uid", "==", user.uid)
            // listen for collection changes for current user
            this.unsubscribeChatUser = this.referenceChatUser.onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        // stop listening to authentication
        this.authUnsubscribe();
        // stop listening for changes
        this.unsubscribeChatUser();
    }

    // Called when user sends a message
    onSend(messages = []) {
        messages.forEach((message) => this.addMessage(message));
        /*this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages[0]),
        }))*/
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

    render() {
        return (

            <View style={{backgroundColor: this.props.navigation.state.params.color, flex: 1}}>

                <GiftedChat
                    //key={this.state._id}
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.uid,
                    }}
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
