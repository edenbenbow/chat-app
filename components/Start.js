import { StyleSheet, Text, View, TextInput, Image, Button, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import Chat from './Chat';


export default class Start extends Component {
    // Allows user to set name for nav, color for BG
    constructor(props) {
        super(props);
        this.state = {
            name: '', // Goes in nav
            color: '' // Sets Chat page background
        };
    }

    render() {
        return (
            // Name field, color selection, and chat button
            <ImageBackground
                style={styles.background}
                source={require('../assets/bg-375x667.png')}>
                <Text style={styles.title}>
                    App Title
                </Text>
                <View style={styles.overlay}>
                    <TextInput
                            style={styles.input}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            placeholder='Your name'/>
                    <Text style={styles.choose}>Choose background color:</Text>
                    <View style={styles.bubbles}>
                        <TouchableOpacity
                            style={[styles.bubbleBlack, styles.bubble]}
                            onPress={() => this.setState({color: '#090c08'})}
                        />
                        <TouchableOpacity
                            style={[styles.bubbleSlate, styles.bubble]}
                            onPress={() => this.setState({color: '#474056'})}
                        />
                        <TouchableOpacity
                            style={[styles.bubbleCoin, styles.bubble]}
                            onPress={() => this.setState({color: '#8A95A5'})}
                        />
                        <TouchableOpacity
                            style={[styles.bubblePistachio, styles.bubble]}
                            onPress={() => this.setState({color: '#B9C6AE'})}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => this.props.navigation.navigate('Chat', {
                                name: this.state.name,
                                color: this.state.color
                            })
                        }
                    >
                        <Text style={styles.start}>
                            Start chatting
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({

    overlay: {
        width: '88%',
        height: '44%',
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: 220
    },

    startButton: {
        height: 60,
        backgroundColor: '#757083',
        width: '88%',
        alignItems: 'center',
        fontSize: 20,
    },

    input: {
        height: 60,
        width: '88%',
        borderColor: 'gray',
        borderWidth: 2,
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 2,
        color: '#757083',
        padding: 10,
        fontSize: 20,
    },

    iconStyle: {
        height: 25,
        width: 25
    },

    choose: {
      fontSize: 18,
      fontWeight: '300',
      color: '#757083',
      marginBottom: 10,
      right: 50,

    },

    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    title: {
        color: '#FFF',
        fontSize: 45,
        fontWeight: '600',
        marginTop: 40,
    },

    bubbles: {
        flexDirection: 'row',
        marginBottom: 10,
        right: 40,
    },

    bubble: {
        width: 42,
        height: 42,
        margin: 10,
        borderRadius: 21,
    },

    bubbleBlack: {
        backgroundColor: '#090C08'
    },

    bubbleSlate: {
        backgroundColor: '#474056'
    },

    bubbleCoin: {
        backgroundColor: '#8A95A5'
    },

    bubblePistachio: {
        backgroundColor: '#B9C6AE'
    },

    start: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        margin: 15,
    }
});


