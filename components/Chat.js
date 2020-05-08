import { StyleSheet, Text, View, TextInput, Alert} from 'react-native';

import React, { Component } from 'react';

export default class Chat extends Component {

    // Name for nav
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
    }

    // Background color selected in Start.js
    render() {
        return (
            <View style={{backgroundColor: this.props.navigation.state.params.color, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: 50}}>
                <Text>Chat screen!</Text>
            </View>
        )
    }}
